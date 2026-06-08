"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Kaamao</h1>
        <p className="text-gray-600 mt-2">Your service marketplace dashboard</p>
      </div>

// Import the Create Service Page component
import CreateServicePage from "./create-service/page";

// --- Types ---
type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
};

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Maths Tutoring</p>
                <p className="text-sm text-gray-500">Rahul Sharma • Today, 10:00 AM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Science Tutoring</p>
                <p className="text-sm text-gray-500">Priya Patel • Tomorrow, 3:00 PM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Confirmed</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Homework Help</p>
                <p className="text-sm text-gray-500">Amit Kumar • Yesterday, 5:00 PM</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// --- Main Content: Dashboard Overview (Completely Blank) ---
const DashboardOverview: React.FC = () => {
  return (
    <div className="w-full h-full">
      {/* Absolutely nothing - completely blank */}
    </div>
  );
};

// --- Placeholder Pages for Other Menu Items (All Blank) ---
const FindServices: React.FC = () => <div className="w-full h-full"></div>;

const NearbyProviders: React.FC = () => <div className="w-full h-full"></div>;

const Analytics: React.FC = () => <div className="w-full h-full"></div>;

const Profile: React.FC = () => <div className="w-full h-full"></div>;

const SettingsPage: React.FC = () => <div className="w-full h-full"></div>;

// --- Floating Action Button ---
const FloatingActionButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Create service"
    title="Create service"
    className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-brand-primary-dark to-brand-primary text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-brand-primary/30 backdrop-blur-sm border border-white/20 z-30 group"
  >
    <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
  </button>
);

// --- Main App Component ---
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(
    null,
  );
  const [userInitials, setUserInitials] = useState<string>("AM");

  // Get initials from user name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Fetch current user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { user } = await getCurrentUser();
        if (!user) {
          console.error("No authenticated user found");
          return;
        }

        const userId = (user as { id?: string })?.id;
        if (!userId) {
          console.error("User ID not available");
          return;
        }

        const result = await getUserProfile(userId);
        if (result.success && result.profile) {
          setUserProfile(result.profile);
          const initials = getInitials(result.profile.full_name || "User");
          setUserInitials(initials);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle navigation with special routing for Profile
  const handleMenuSelect = (id: string) => {
    if (id === "profile") {
      router.push("/dashboard/profile");
    } else {
      setCurrentPage(id);
    }
  };

  useEffect(() => {
    async function checkAuthAndProfile() {
      try {
        const { user: authUser } = await getCurrentUser();
        if (!authUser) {
          router.push("/login");
          return;
        }

        const authUserObj = authUser as SupabaseUser;
        setUser(authUserObj);

        if (supabase) {
          // Check if profile exists in public.users
          const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUserObj.id)
            .maybeSingle();

          if (userProfile) {
            setProfile(userProfile as UserProfile);
          } else {
            // Profile doesn't exist (e.g. third-party login or failed insert during signup)
            // Save user details safely via the backend API using JWT
            const fullName =
              authUserObj.user_metadata?.full_name ||
              authUserObj.user_metadata?.name ||
              authUserObj.email?.split("@")[0] ||
              "User";
            const email = authUserObj.email || "";
            const phoneNo =
              authUserObj.user_metadata?.phone_no ||
              `google_${authUserObj.id.slice(0, 8)}`;

            // Get session token for authentication
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;

            if (token) {
              const response = await fetch("/api/auth/sync-profile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  id: authUserObj.id,
                  fullName,
                  email,
                  phoneNo,
                }),
              });

              const result = await response.json();
              if (response.ok && result.success) {
                // Fetch the newly created profile
                const { data: newProfile } = await supabase
                  .from("users")
                  .select("*")
                  .eq("id", authUserObj.id)
                  .maybeSingle();
                if (newProfile) {
                  setProfile(newProfile as UserProfile);
                }
              } else {
                console.error(
                  "Failed to automatically save profile in database via API:",
                  result.error || result,
                );
              }
            } else {
              console.error(
                "No active session JWT token found to sync profile.",
              );
            }
          }
        }
      } catch (err) {
        console.error("Auth and profile loading failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthAndProfile();
  }, [router]);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: currentPage === "dashboard",
    },
    {
      id: "create-service",
      label: "Create Service",
      icon: Briefcase,
      active: currentPage === "create-service",
    },
    {
      id: "find-services",
      label: "Find Services",
      icon: Search,
      active: currentPage === "find-services",
    },
    {
      id: "nearby-service",
      label: "Nearby Providers",
      icon: MapPin,
      active: currentPage === "nearby-service",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      active: currentPage === "analytics",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      active: currentPage === "profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      active: currentPage === "settings",
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />;
      case "create-service":
        return <CreateServicePage />;
      case "find-services":
        return <FindServices />;
      case "nearby":
        return <NearbyProviders />;
      case "analytics":
        return <Analytics />;
      case "profile":
        return <Profile />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        router.push("/login");
      } else {
        console.error("Signout failed:", result.error);
      }
    } catch (err) {
      console.error("Logout exception:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg-light flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const pName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const pEmail = user?.email || "";
  const initials =
    pName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <div className="min-h-screen bg-brand-bg-light font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        onSelect={handleMenuSelect}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        profileName={pName}
        profileEmail={pEmail}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}
      >
        {/* Top Header - Glassmorphism */}
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Left: Search Bar - Increased Length */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/50 border border-gray-200/80 focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm"
              />
            </div>
            <div className="pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                <span className="text-sm font-medium text-gray-900">Rohit Mehta</span>
              </div>
              <p className="text-sm text-gray-600">Explains concepts very clearly and patiently.</p>
              <p className="text-xs text-gray-400 mt-1">1 month ago</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{renderPage()}</div>
      </main>

      {/* Floating Action Button - Only show on dashboard */}
      {currentPage === "dashboard" && (
        <FloatingActionButton onClick={() => setCurrentPage("create-service")} />
      )}
    </div>
  );
}