import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.projectType || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save the inquiry so it shows up in the admin CMS. This is the source
    // of truth for the request; the email below is a best-effort notification.
    const { error: insertError } = await supabase.from('inquiries').insert({
      name: data.name,
      email: data.email,
      project_type: data.projectType,
      other_project_type: data.otherProjectType || null,
      description: data.description,
    });

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      );
    }

    // Prepare email content
    const projectTypeDisplay = data.projectType === 'other' 
      ? `Other (${data.otherProjectType})` 
      : data.projectType;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #1a1a1a;">New Inquiry: Muso Production</h2>
        <p>You have received a new project inquiry from the website contact form.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Contact Details</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          
          <h3 style="margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Project Information</h3>
          <p><strong>Project Type:</strong> <span style="text-transform: capitalize;">${projectTypeDisplay}</span></p>
          
          <p><strong>General Description:</strong></p>
          <div style="background-color: #fff; padding: 15px; border: 1px solid #e0e0e0; border-radius: 4px; white-space: pre-wrap;">${data.description}</div>
        </div>
        
        <p style="font-size: 12px; color: #888; margin-top: 30px;">This email was sent automatically from your website's contact form.</p>
      </div>
    `;

    // Attempt to send the email notification. Best-effort: the inquiry is
    // already saved above, so a Resend failure shouldn't fail the request.
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const resendData = await resend.emails.send({
        from: 'Muso Production Inquiries <info@musoproduction.com>',
        to: ['info@musoproduction.com'],
        replyTo: data.email,
        subject: `New Inquiry from ${data.name} - ${projectTypeDisplay}`,
        html: htmlContent,
      });

      if (resendData.error) {
        console.error('Resend API Error:', resendData.error);
      }
    } catch (emailError) {
      console.error('Resend API Error:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
