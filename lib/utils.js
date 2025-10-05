/**
 * Configuration for form field sections
 */
const FORM_SECTIONS = {
  personal: {
    title: "Personal Information",
    fields: [
      { key: "firstName", label: "First Name", type: "text" },
      { key: "lastName", label: "Last Name", type: "text" },
      { key: "dateOfBirth", label: "Date of Birth", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "text" },
    ],
  },
  medical: {
    title: "Medical History",
    fields: [
      { key: "epilepsy", label: "Epilepsy", type: "boolean" },
      { key: "jaundice", label: "Jaundice", type: "boolean" },
      { key: "hypertension", label: "Hypertension", type: "boolean" },
      { key: "pastIllnesses", label: "Past Illnesses", type: "array" },
      { key: "chronicDiseases", label: "Chronic Diseases", type: "array" },
      { key: "implants", label: "Implants", type: "array" },
      { key: "infectionHistory", label: "Infection History", type: "array" },
      { key: "cut_bleed", label: "Bleeds Longer After Cuts", type: "boolean" },
      { key: "allergies", label: "Allergies", type: "array" },
      { key: "bleedingDisorders", label: "Bleeding Disorders", type: "array" },
      { key: "blood_clot", label: "Excessive Blood Clotting", type: "boolean" },
      { key: "asthma", label: "Bronchial Asthma", type: "boolean" },
      {
        key: "tuberculosisHistory",
        label: "Tuberculosis History",
        type: "array",
      },
      { key: "pepticUlcerSites", label: "Peptic Ulcer Sites", type: "array" },
      {
        key: "otherDiseases",
        label: "Other Diseases",
        type: "text",
        defaultValue: "None",
      },
      {
        key: "medications",
        label: "Current Medications",
        type: "text",
        defaultValue: "None",
      },
      {
        key: "surgeries",
        label: "Surgeries History",
        type: "text",
        defaultValue: "None",
      },
      {
        key: "cigarettes",
        label: "Cigarettes Per Day",
        type: "number",
        defaultValue: "Not specified",
      },
      { key: "alcohol", label: "Drinks Alcohol Daily", type: "boolean" },
      { key: "drugs", label: "Uses Drugs", type: "boolean" },
    ],
  },
  additional: {
    title: "Additional Details",
    fields: [
      {
        key: "details",
        label: "Additional Details",
        type: "text",
        defaultValue: "None",
      },
    ],
  },
  consent: {
    title: "Consent",
    fields: [
      { key: "hipaaConsent", label: "HIPAA Consent", type: "boolean" },
      { key: "treatmentConsent", label: "Treatment Consent", type: "boolean" },
    ],
  },
};

/**
 * Configuration for new patient questionnaire form
 */
const PATIENT_QUESTIONNAIRE_SECTIONS = {
  personal: {
    title: "Personal Information",
    fields: [
      { key: "firstName", label: "First Name", type: "text" },
      { key: "lastName", label: "Last Name", type: "text" },
      { key: "dateOfBirth", label: "Date of Birth", type: "text" },
      { key: "gender", label: "Gender", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "text" },
    ],
  },
  address: {
    title: "Address Information",
    fields: [
      { key: "address", label: "Address", type: "text" },
      { key: "city", label: "City", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "zipCode", label: "ZIP Code", type: "text" },
    ],
  },
  emergency: {
    title: "Emergency Contact",
    fields: [
      { key: "emergencyName", label: "Emergency Contact Name", type: "text" },
      { key: "emergencyPhone", label: "Emergency Contact Phone", type: "text" },
      { key: "emergencyRelationship", label: "Relationship", type: "text" },
    ],
  },

  referral: {
    title: "How Did You Hear About Us",
    fields: [
      { key: "hearAboutUs", label: "How Did You Hear About Us", type: "text" },
      {
        key: "referralDetails",
        label: "Referral Details",
        type: "text",
        defaultValue: "None",
      },
    ],
  },
  consent: {
    title: "Consent",
    fields: [
      { key: "hipaaConsent", label: "HIPAA Consent", type: "boolean" },
      { key: "treatmentConsent", label: "Treatment Consent", type: "boolean" },
      { key: "signature", label: "Signature", type: "text" },
    ],
  },
};

/**
 * Formats patient data for email with improved structure and readability
 * @param {Object} formatData - Object containing formData
 * @param {string} lang - Language code
 * @returns {string} Formatted HTML email content
 */
const formatPatientDataForEmail = (formatData, lang) => {
  console.log("Formatting patient data for email:", formatData);
  const { formData } = formatData;

  // Helper functions
  const formatArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return "None";
    return arr.length > 0 ? arr.join(", ") : "None";
  };

  const formatBoolean = (value) => (value ? "Yes" : "No");

  const formatNumber = (value, defaultValue = "Not specified") =>
    value !== null && value !== undefined ? value.toString() : defaultValue;

  const formatText = (value, defaultValue = "Not provided") =>
    value || defaultValue;

  const createListItem = (label, value) =>
    `<li><strong>${label}:</strong> ${value}</li>`;

  // Format field based on type
  const formatFieldValue = (field, formData) => {
    const value = formData[field.key];

    switch (field.type) {
      case "boolean":
        return formatBoolean(value);
      case "array":
        return formatArray(value);
      case "number":
        return formatNumber(value, field.defaultValue);
      case "text":
      default:
        return formatText(value, field.defaultValue || "Not provided");
    }
  };

  // Handle special case for name formatting
  const formatName = (formData) => {
    const firstName = formatText(formData.firstName);
    const lastName = formatText(formData.lastName, "");
    return firstName === "Not provided" && lastName === ""
      ? "Not provided"
      : `${firstName} ${lastName}`.trim();
  };

  // Generate sections
  const generateSection = (sectionKey, section) => {
    let fields;

    // Special handling for personal info (name combination)
    if (sectionKey === "personal") {
      fields = [
        createListItem("Name", formatName(formData)),
        ...section.fields
          .slice(2)
          .map((field) =>
            createListItem(field.label, formatFieldValue(field, formData))
          ),
      ];
    } else {
      fields = section.fields.map((field) =>
        createListItem(field.label, formatFieldValue(field, formData))
      );
    }

    return `
    <h3>${section.title}</h3>
    <ul>
      ${fields.join("\n      ")}
    </ul>`;
  };

  // Generate signature section
  const signatureSection = formData.signature
    ? "<h3>Signature</h3><p>Digital signature provided</p>"
    : "";

  // Build sections
  const sections = Object.entries(FORM_SECTIONS)
    .map(([key, section]) => generateSection(key, section))
    .join("\n    ");

  // Build the complete email template
  return `
    <h2>New Dental Medical Form Submission</h2>
    ${sections}
    
    ${signatureSection}
    
    <p><strong>Form Language:</strong> ${lang}</p>
    <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
  `;
};

/**
 * Formats patient registration data for email
 * @param {Object} formatData - Object containing patientData
 * @param {string} lang - Language code
 * @returns {string} Formatted HTML email content
 */
const formatPatientQuestionnaireForEmail = (formatData, lang) => {
  console.log("Formatting patient registration data for email:", formatData);
  const { patientData } = formatData;

  // Helper functions
  const formatText = (value, defaultValue = "Not provided") =>
    value || defaultValue;

  const formatBoolean = (value) => (value ? "Yes" : "No");

  const createListItem = (label, value) =>
    `<li><strong>${label}:</strong> ${value}</li>`;

  // Format field based on type
  const formatFieldValue = (field, patientData) => {
    const value = patientData[field.key];

    switch (field.type) {
      case "boolean":
        return formatBoolean(value);
      case "text":
      default:
        return formatText(value, field.defaultValue || "Not provided");
    }
  };

  // Handle special case for name formatting
  const formatName = (patientData) => {
    const firstName = formatText(patientData.firstName);
    const lastName = formatText(patientData.lastName, "");
    return firstName === "Not provided" && lastName === ""
      ? "Not provided"
      : `${firstName} ${lastName}`.trim();
  };

  // Handle address formatting
  const formatAddress = (patientData) => {
    const address = formatText(patientData.address, "");
    const city = formatText(patientData.city, "");
    const state = formatText(patientData.state, "");
    const zipCode = formatText(patientData.zipCode, "");

    const addressParts = [address, city, state, zipCode].filter(
      (part) => part !== "" && part !== "Not provided"
    );

    return addressParts.length > 0 ? addressParts.join(", ") : "Not provided";
  };

  // Generate sections
  const generateSection = (sectionKey, section) => {
    let fields;

    // Special handling for different sections
    if (sectionKey === "personal") {
      fields = [
        createListItem("Name", formatName(patientData)),
        ...section.fields
          .slice(2) // Skip firstName and lastName as they're combined
          .map((field) =>
            createListItem(field.label, formatFieldValue(field, patientData))
          ),
      ];
    } else if (sectionKey === "address") {
      fields = [
        createListItem("Full Address", formatAddress(patientData)),
        ...section.fields.map((field) =>
          createListItem(field.label, formatFieldValue(field, patientData))
        ),
      ];
    } else {
      fields = section.fields.map((field) =>
        createListItem(field.label, formatFieldValue(field, patientData))
      );
    }

    return `
    <h3>${section.title}</h3>
    <ul>
      ${fields.join("\n      ")}
    </ul>`;
  };

  // Build sections
  const sections = Object.entries(PATIENT_QUESTIONNAIRE_SECTIONS)
    .map(([key, section]) => generateSection(key, section))
    .join("\n    ");

  // Build the complete email template
  return `
    <h2>New Patient Registration</h2>
    ${sections}
    
    <p><strong>Form Language:</strong> ${lang}</p>
    <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
  `;
};
/**
 * Enhanced email formatting utility with additional helper functions
 * @param {Object} formatData - Object containing formData
 * @param {string} lang - Language code
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted HTML email content
 */
const formatPatientDataForEmailAdvanced = (formatData, lang, options = {}) => {
  const {
    includeEmptyFields = false,
    customStyles = false,
    compactMode = false,
  } = options;

  console.log("Formatting patient data for email:", formatData);
  const { formData } = formatData;

  // Helper functions
  const formatArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return includeEmptyFields ? "None" : null;
    return arr.length > 0 ? arr.join(", ") : includeEmptyFields ? "None" : null;
  };

  const formatBoolean = (value) => (value ? "Yes" : "No");

  const formatNumber = (value, defaultValue = "Not specified") =>
    value !== null && value !== undefined
      ? value.toString()
      : includeEmptyFields
      ? defaultValue
      : null;

  const formatText = (value, defaultValue = "Not provided") =>
    value || (includeEmptyFields ? defaultValue : null);

  const createListItem = (label, value) => {
    if (
      !includeEmptyFields &&
      (value === null || value === "Not provided" || value === "None")
    ) {
      return null;
    }
    return compactMode
      ? `<li>${label}: ${value}</li>`
      : `<li><strong>${label}:</strong> ${value}</li>`;
  };

  // Format field based on type
  const formatFieldValue = (field, formData) => {
    const value = formData[field.key];

    switch (field.type) {
      case "boolean":
        return formatBoolean(value);
      case "array":
        return formatArray(value);
      case "number":
        return formatNumber(value, field.defaultValue);
      case "text":
      default:
        return formatText(value, field.defaultValue || "Not provided");
    }
  };

  // Handle special case for name formatting
  const formatName = (formData) => {
    const firstName = formatText(formData.firstName);
    const lastName = formatText(formData.lastName, "");

    if (
      !includeEmptyFields &&
      firstName === "Not provided" &&
      lastName === ""
    ) {
      return null;
    }

    return firstName === "Not provided" && lastName === ""
      ? "Not provided"
      : `${firstName} ${lastName}`.trim();
  };

  // Generate sections with filtering
  const generateSection = (sectionKey, section) => {
    let fields;

    // Special handling for personal info (name combination)
    if (sectionKey === "personal") {
      const nameItem = createListItem("Name", formatName(formData));
      const otherFields = section.fields
        .slice(2)
        .map((field) =>
          createListItem(field.label, formatFieldValue(field, formData))
        )
        .filter((item) => item !== null);

      fields = [nameItem, ...otherFields].filter((item) => item !== null);
    } else {
      fields = section.fields
        .map((field) =>
          createListItem(field.label, formatFieldValue(field, formData))
        )
        .filter((item) => item !== null);
    }

    // Don't include section if no fields
    if (fields.length === 0) return "";

    return `
    <h3>${section.title}</h3>
    <ul>
      ${fields.join("\n      ")}
    </ul>`;
  };

  // Generate signature section
  const signatureSection = formData.signature
    ? "<h3>Signature</h3><p>Digital signature provided</p>"
    : "";

  // CSS styles for enhanced formatting
  const styles = customStyles
    ? `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
      h3 { color: #34495e; margin-top: 20px; }
      ul { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
      li { margin-bottom: 5px; }
      strong { color: #2c3e50; }
      .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 0.9em; color: #666; }
    </style>
  `
    : "";

  // Build sections
  const sections = Object.entries(FORM_SECTIONS)
    .map(([key, section]) => generateSection(key, section))
    .filter((section) => section !== "")
    .join("\n    ");

  // Build the complete email template
  return `${styles}
    <h2>New Dental Medical Form Submission</h2>
    ${sections}
    
    ${signatureSection}
    
    <div class="footer">
      <p><strong>Form Language:</strong> ${lang}</p>
      <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
    </div>
  `;
};

module.exports = {
  formatPatientDataForEmail,
  formatPatientDataForEmailAdvanced,
  formatPatientQuestionnaireForEmail,
  FORM_SECTIONS,
  PATIENT_QUESTIONNAIRE_SECTIONS,
};
