/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const formId = e.record.get("form_id");
  if (!formId) {
    e.next();
    return;
  }

  try {
    const form = $app.findRecordById("forms", formId);
    const sendEmailTo = form.get("send_email_to");
    
    if (!sendEmailTo) {
      e.next();
      return;
    }

    const submissionData = e.record.get("submission_data");
    const submitterEmail = e.record.get("submitter_email");
    const submitterName = e.record.get("submitter_name");
    const formTitle = form.get("title");

    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: sendEmailTo }],
      subject: "New Form Submission: " + formTitle,
      html: "<h2>New Form Submission</h2>" +
            "<p><strong>Form:</strong> " + formTitle + "</p>" +
            "<p><strong>Submitter Name:</strong> " + (submitterName || "Not provided") + "</p>" +
            "<p><strong>Submitter Email:</strong> " + (submitterEmail || "Not provided") + "</p>" +
            "<p><strong>Submission Data:</strong></p>" +
            "<pre>" + (submissionData || "No data") + "</pre>"
    });
    
    $app.newMailClient().send(message);
  } catch (err) {
    console.log("Error sending admin email: " + err.message);
  }
  
  e.next();
}, "form_submissions");