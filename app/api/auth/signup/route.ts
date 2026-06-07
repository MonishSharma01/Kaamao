import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client with service role (bypasses rate limits and RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, phoneNo, dob, locationCity, neighborhood, pincode } = body;

    // Validate required fields
    if (!email || !password || !fullName || !phoneNo || !dob || !locationCity || !pincode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNo.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create user using admin API (no rate limits!)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email so user can login immediately
      user_metadata: {
        full_name: fullName,
        phone_no: phoneNo,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      
      if (authError.message.includes("User already registered")) {
        return NextResponse.json(
          { error: "This email is already registered. Please login instead." },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Insert into users table using admin client (bypasses RLS)
    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        full_name: fullName,
        email: email,
        phone_no: phoneNo,
        dob: dob,
        location_city: locationCity,
        neighborhood: neighborhood || null,
        pincode: pincode,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      // User created but profile insert failed - still return success
      return NextResponse.json(
        { 
          success: true, 
          message: "Account created successfully! Please login.",
          warning: "Profile setup had issues, but you can still login."
        },
        { status: 200 }
      );
    }

    console.log("User created successfully:", authData.user.id);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Account created successfully! Please login."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}