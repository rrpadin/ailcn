/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const formId = e.record.get("form_id");
  const submitterEmail = e.record.get("submitter_email");
  
  if (!formId || !submitterEmail) {
    e.next();
    return;
  }

  try {
    const form = $app.findRecordById("forms", formId);
    const sendConfirmation = form.get("send_confirmation_email");
    
    if (!sendConfirmation) {
      e.next();
      return;
    }

    const successMessage = form.get("success_message");
    const formTitle = form.get("title");

    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: submitterEmail }],
      subject: "Confirmation: " + formTitle,
      html: "<h2>Thank You for Your Submission</h2>" +
            "<p><strong>Form:</strong> " + formTitle + "</p>" +
            "<p>" + (successMessage || "We have received your submission and will get back to you soon.") + "</p>"
    });
    
    $app.newMailClient().send(message);
  } catch (err) {
    console.log("Error sending confirmation email: " + err.message);
  }
  
  e.next();
}, "form_submissions");