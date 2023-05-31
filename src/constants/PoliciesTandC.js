import React from "react";

function PoliciesTandC() {
  return (
    <div className="App-header">
      <br />
      <br />
      <h2>Vidhavani Policies</h2>
      <div style={{ textAlign: "left" }}>
        <h3 style={{ textAlign: "center" }}>Terms and Conditions</h3>
        <p>
          Welcome to Vidhavani, an investment app provided by Vidhavani
          Enterprises. By accessing or using our app, you
          agree to be bound by the following terms and conditions:
        </p>
        <ol>
          <li>
            Eligibility: You must be at least 18 years old and a resident of
            India to use our app.
          </li>
          <li>
            Investment Plans: We offer investment plans for 1, 2, 3, 4, and 5
            years. Once you purchase an investment plan, you cannot cancel or
            withdraw your investment before the end of the investment period.
          </li>
          <li>
            Payment: All payments are processed through Razor Pay payment
            gateway. We do not store your payment information.
          </li>
          <li>
            User Data: We collect and store your user data, including your KYC
            information and investment plan details, in accordance with our
            Privacy Policy.
          </li>
          <li>
            Disclaimer: We do not provide investment advice and are not
            responsible for any losses or damages that may result from your use
            of our app.
          </li>
          <li>
            Modification: We reserve the right to modify these terms and
            conditions at any time. Your continued use of our app after any such
            modifications shall constitute your agreement to the updated terms
            and conditions.
          </li>
        </ol>

        <h3 style={{ textAlign: "center" }}>Privacy Policy</h3>
        <p>
          We take your privacy seriously and are committed to protecting your
          personal information. This privacy policy describes how we collect,
          use, and disclose your personal information:
        </p>
        <ol>
          <li>
            Information we collect: We collect your KYC information and
            investment plan details when you sign up for our app or buys a new investment plan. We may also
            collect information about your device and usage of our app.
          </li>
          <li>
            Use of information: We use your information to provide and improve
            our app, to communicate with you, and to comply with legal and
            regulatory requirements.
          </li>
          <li>
            Disclosure of information: We may disclose your information to our
            service providers, government authorities, or as required by law.
          </li>
          <li>
            Security: We take reasonable measures to protect your personal
            information from unauthorized access or disclosure.
          </li>
          <li>
            Retention: We retain your personal information for as long as
            necessary to fulfill the purposes for which it was collected, or as
            required by law.
          </li>
          <li>
            Third-party links: Our app may contain links to third-party websites
            or services. We are not responsible for the privacy practices of
            those websites or services.
          </li>
        </ol>

        <h3 style={{ textAlign: "center" }}>Cancellation/Refund Policy</h3>
        <p>
          Once you purchase an investment plan, you cannot cancel or withdraw
          your investment before the end of the investment period. We do not
          offer refunds for any investments made through our app.
        </p>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default PoliciesTandC;
