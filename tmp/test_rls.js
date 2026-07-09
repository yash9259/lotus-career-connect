const url = "https://crklmponocroljdofzdo.supabase.co/rest/v1/job_posts";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya2xtcG9ub2Nyb2xqZG9memRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDE4MzksImV4cCI6MjA5Nzg3NzgzOX0.X1kMNv61QFOLolYD0tdHfvfSLZRz8721A5_FvAkDZ-8";

async function test() {
  const jobId = crypto.randomUUID();
  const payload = {
    id: jobId,
    company_name: "Test Fix Client UUID Company",
    position: "Test Position",
    vacancy: 1,
    gender: "Any",
    experience: "1 year",
    qualification: "Graduate",
    salary_min: 10000,
    salary_max: 20000,
    salary_range_text: "₹10,000 - ₹20,000",
    job_time: "Full Time",
    location: "Test Location",
    responsibilities: "Test Responsibilities",
    description: "Test Description",
    interview_contact_name: "Test Contact",
    interview_contact_number: "1234567890",
    company_email: "test-clientuuid@test.com",
    status: "pending",
    created_by: null
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
    console.log("Successfully generated & inserted Job ID:", jobId);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
