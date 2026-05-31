import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "mockKeyPart1.mockKeyPart2.mockKeyPart3";

export const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    "Supabase env missing. Dynamic operations will run in degraded/direct-fail mode.",
  );
}

// Client initialization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForSupabase = globalThis as unknown as { supabaseClient: any };
let supabaseClient = globalForSupabase.supabaseClient || null;

if (!supabaseClient) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    if (process.env.NODE_ENV !== "production") {
      globalForSupabase.supabaseClient = supabaseClient;
    }
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
}

export interface UserSubmission {
  name: string;
  phone: string;
  gender: string;
  dob: string;
}

async function ensureProjectExists(
  registrationNumber: string,
  projectName: string,
): Promise<number | null> {
  if (!isSupabaseConfigured || !supabaseClient) {
    console.warn("Supabase not configured, cannot ensure project exists");
    return null;
  }

  try {
    const { data: project } = await supabaseClient
      .from("projects")
      .select("project_id")
      .eq("registration_number", registrationNumber)
      .maybeSingle();

    if (project) {
      return project.project_id;
    }

    console.log("Project not found, creating new project...");
    const { data: newProject, error: insertError } = await supabaseClient
      .from("projects")
      .insert([
        {
          registration_number: registrationNumber,
          project_name: projectName,
          registered_people_count: 0,
        },
      ])
      .select("project_id")
      .maybeSingle();

    if (insertError) {
      console.error("Error creating project:", insertError);
      return null;
    }

    return newProject?.project_id || null;
  } catch (err) {
    console.error("Exception in ensureProjectExists:", err);
    return null;
  }
}

export async function submitWaitlist(
  data: UserSubmission,
  projectId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return {
      success: false,
      error:
        "Supabase is not configured. Please set your environment variables.",
    };
  }

  try {
    const numericProjectId = await ensureProjectExists(
      projectId,
      projectId === "damusia" ? "Damusia" : projectId,
    );

    if (!numericProjectId) {
      return {
        success: false,
        error: "Unable to create or find project.",
      };
    }

    // Check for existing user
    const { data: existingUsers, error: checkError } = await supabaseClient
      .from("interested_users")
      .select("id")
      .eq("project_id", numericProjectId)
      .eq("phone_number", data.phone.trim())
      .limit(1);

    if (checkError) {
      console.error("Supabase check error:", checkError);
      return {
        success: false,
        error: "Database verification failed. Please try again.",
      };
    }

    if (existingUsers && existingUsers.length > 0) {
      return {
        success: false,
        error: "This phone number has already shown interest.",
      };
    }

    // Log the gender being inserted
    console.log("Inserting user with gender:", data.gender);

    // Insert new user - use gender directly without mapping
    const { error: insertError } = await supabaseClient
      .from("interested_users")
      .insert([
        {
          project_id: numericProjectId,
          full_name: data.name.trim(),
          phone_number: data.phone.trim(),
          gender: data.gender, // Direct use - should be "Male" or "Female"
          date_of_birth: data.dob,
        },
      ]);

    if (insertError) {
      console.error("Supabase insertion error:", insertError);
      // Catch duplicate constraint error
      if (insertError.code === "23505") {
        return {
          success: false,
          error: "This phone number has already shown interest.",
        };
      }
      return { success: false, error: insertError.message };
    }

    // Update the registered_people_count
    const { data: projectData } = await supabaseClient
      .from("projects")
      .select("registered_people_count")
      .eq("project_id", numericProjectId)
      .single();

    if (projectData) {
      const newCount = (projectData.registered_people_count || 0) + 1;
      await supabaseClient
        .from("projects")
        .update({ registered_people_count: newCount })
        .eq("project_id", numericProjectId);
    }

    return { success: true };
  } catch (err) {
    console.error("Supabase connection exception:", err);
    const message =
      err instanceof Error ? err.message : "Database connection failed";
    return { success: false, error: message };
  }
}

export async function logClick(
  visitorId: string,
  projectId: string,
  clickedJoin: boolean = true,
): Promise<void> {
  if (!isSupabaseConfigured || !supabaseClient) {
    console.warn(
      `Click analytics log bypassed (unconfigured db) for: ${projectId}`,
    );
    return;
  }

  try {
    // Log analytics event
    console.log("Analytics Event:", {
      visitorId,
      projectId,
      clickedJoin,
    });
  } catch (err) {
    console.error("Supabase analytics logging error:", err);
  }
}

/**
 * Fetch total interest count for a specific project.
 */
export async function getInterestCount(projectId: string): Promise<number> {
  if (!isSupabaseConfigured || !supabaseClient) {
    return 428; // Return default count when not configured
  }

  try {
    const { data: projectData, error: projectError } = await supabaseClient
      .from("projects")
      .select("project_id, registered_people_count")
      .eq("registration_number", projectId)
      .maybeSingle();

    if (projectError || !projectData) {
      return 0;
    }

    // Return the registered_people_count from projects table
    return projectData.registered_people_count || 0;
  } catch (err) {
    console.error("Count exception:", err);
    return 0;
  }
}

export const supabase = supabaseClient;