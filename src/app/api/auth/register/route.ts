import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-url";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // This is server-side, so use absolute URL
    const apiUrl = getApiUrl('/api/auth/register/', true);

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await resp.json();
    if (!resp.ok) {
      console.error('Django register error:', resp.status, json);
      // Extract error message from Django response
      let message = 'Registration failed';
      
      // Check for field-specific errors (password, email, name, etc.)
      if (json.errors && typeof json.errors === 'object') {
        const firstField = Object.keys(json.errors)[0];
        const firstError = json.errors[firstField];
        if (Array.isArray(firstError) && firstError.length > 0) {
          message = firstError[0];
        } else if (typeof firstError === 'string') {
          message = firstError;
        }
      } else if (json.email && Array.isArray(json.email)) {
        message = json.email[0];
      } else if (json.email && typeof json.email === 'string') {
        message = json.email;
      } else if (json.password && Array.isArray(json.password)) {
        message = json.password[0];
      } else if (json.password && typeof json.password === 'string') {
        message = json.password;
      } else if (json.message) {
        message = json.message;
      } else if (json.detail) {
        message = json.detail;
      } else if (json.error) {
        message = typeof json.error === 'string' ? json.error : 'Registration failed';
      }
      console.error('[REGISTER] Extracted error message:', message);
      return NextResponse.json({ message }, { status: resp.status });
    }

    return NextResponse.json(json, { status: 201 });
  } catch (error) {
    console.error('[REGISTRATION_ERROR]', error);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 500 });
  }
}