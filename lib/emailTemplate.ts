import { EmailFormData } from "../models/EmailFormData";

export interface EmailTemplateProps {
  data: EmailFormData;
}

export function EmailTemplate({ data }: EmailTemplateProps) {
  return `
    <div style="font-family: 'Inter', 'Helvetica Neue', 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; font-weight: 300;">
      <!-- Header -->
      <div style="background-color: #736661; padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.5px;">
          Confident Clinic
        </h1>
        <p style="color: #f5f3f2; margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
          New Patient Registration
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 40px 30px;">
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 30px; font-weight: 300;">
          A new patient registration has been submitted. Please find the details below:
        </p>

        <!-- Personal Information Section -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #736661; font-size: 20px; font-weight: 400; margin-bottom: 20px; border-bottom: 2px solid #736661; padding-bottom: 10px; letter-spacing: 0.3px;">
            Personal Information
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; width: 40%; font-weight: 400;">
                  Full Name
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.firstName} ${data.lastName}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; font-weight: 400;">
                  Date of Birth
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.dateOfBirth}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; font-weight: 400;">
                  Gender
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.gender}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; font-weight: 400;">
                  Email
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.email}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; font-weight: 400;">
                  Phone
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.phone}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; font-weight: 400;">
                  Address
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.address}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Emergency Contact Section -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #736661; font-size: 20px; font-weight: 400; margin-bottom: 20px; border-bottom: 2px solid #736661; padding-bottom: 10px; letter-spacing: 0.3px;">
            Emergency Contact
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; width: 40%; font-weight: 400;">
                  Contact Name
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.emergencyContactName}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; font-weight: 400;">
                  Contact Phone
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.emergencyContactPhone}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Additional Information Section -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #736661; font-size: 20px; font-weight: 400; margin-bottom: 20px; border-bottom: 2px solid #736661; padding-bottom: 10px; letter-spacing: 0.3px;">
            Additional Information
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; width: 40%; font-weight: 400;">
                  How did you hear about us?
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  ${data.hearAboutUs}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #736661; font-size: 14px; font-weight: 400;">
                  Consent Given
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px; font-weight: 300;">
                  <span style="color: #736661; font-weight: 400;">
                    ✓ Yes
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Signature Section -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #736661; font-size: 20px; font-weight: 400; margin-bottom: 20px; border-bottom: 2px solid #736661; padding-bottom: 10px; letter-spacing: 0.3px;">
            Signature
          </h2>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; width: 100%; box-sizing: border-box;">
            <img 
              src="${data.signature}" 
              alt="Patient Signature" 
              style="max-width: 300px; height: auto; border: 1px solid #e0e0e0; background-color: #ffffff; padding: 10px; border-radius: 4px;"
            />
          </div>
        </div>

        <!-- Timestamp -->
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin-top: 30px;">
          <p style="color: #736661; font-size: 13px; margin: 0; text-align: center; font-weight: 300;">
            Submitted on ${new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f5f5f5; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #736661; font-size: 14px; margin: 0 0 5px 0; font-weight: 400;">
          Confident Clinic
        </p>
        <p style="color: #999999; font-size: 12px; margin: 0; font-weight: 300;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    </div>`;
}
