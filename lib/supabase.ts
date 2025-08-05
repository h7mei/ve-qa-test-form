import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type QATestReport = {
  id?: string;
  tester_name: string;
  test_date: string;
  application_version: string;
  auth_tests: Record<string, { status: string; notes: string }>;
  main_section_tests: Record<string, { status: string; notes: string }>;
  side_mission_tests: Record<string, { status: string; notes: string }>;
  food_print_tests: { status: string; notes: string };
  leaderboard: { status: string; notes: string; type: string };
  toko: { status: string; notes: string };
  komunitas: { status: string; notes: string };
  hasil_user: { status: string; notes: string };
  sertifikat: { status: string; notes: string };
  user_profile: { status: string; notes: string };
  created_at?: string;
  updated_at?: string;
};

export type InternalTestingCase = {
  id?: string;
  test_name: string;
  sections: Record<
    string,
    {
      textFeedback: string;
      imageFile?: File | null;
      imageUrl?: string;
      feedback: string;
      status: string;
    }
  >;
  created_at?: string;
  updated_at?: string;
};

// Helper function to upload image file to Supabase storage
export const uploadTestingImage = async (file: File, filename: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage.from("testing-images").upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // Get public URL for the uploaded image
    const { data: urlData } = supabase.storage.from("testing-images").getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

// Helper function to fetch internal testing cases
export const fetchInternalTestingCases = async (): Promise<InternalTestingCase[]> => {
  try {
    const { data, error } = await supabase
      .from("internal_testing_cases")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching internal testing cases:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching internal testing cases:", error);
    return [];
  }
};

// Helper function to submit internal testing case with image uploads
export const submitInternalTestingCase = async (
  testCase: InternalTestingCase
): Promise<{ success: boolean; error?: string }> => {
  try {
    const sectionsWithUrls: Record<string, any> = {};

    // Upload images and get URLs
    for (const [sectionName, sectionData] of Object.entries(testCase.sections)) {
      sectionsWithUrls[sectionName] = {
        textFeedback: sectionData.textFeedback,
        feedback: sectionData.feedback,
        status: sectionData.status,
        imageUrl: null,
      };

      // Upload image if present
      if (sectionData.imageFile) {
        const timestamp = Date.now();
        const filename = `${testCase.test_name.replace(/\s+/g, "_")}_${sectionName.replace(
          /\s+/g,
          "_"
        )}_${timestamp}.${sectionData.imageFile.name.split(".").pop()}`;
        const imageUrl = await uploadTestingImage(sectionData.imageFile, filename);
        sectionsWithUrls[sectionName].imageUrl = imageUrl;
      }
    }

    // Insert the record into the database
    const { data, error } = await supabase
      .from("internal_testing_cases")
      .insert({
        test_name: testCase.test_name,
        sections: sectionsWithUrls,
      })
      .select();

    if (error) {
      console.error("Error inserting testing case:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting testing case:", error);
    return { success: false, error: "Failed to submit testing case" };
  }
};
