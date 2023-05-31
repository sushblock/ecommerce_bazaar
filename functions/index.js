/* eslint-disable camelcase */
const functions = require("firebase-functions");
const cors = require("cors")();

const shortid = require("shortid");
const Razorpay = require("razorpay");
// Initialize Razorpay instance
// configuration set cmd firebase functions:config:set gmail.email="...." etc
const key_id = functions.config().rzp.key_id;
const key_secret = functions.config().rzp.key_secret;
const instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

const crypto = require("crypto");

const nodemailer = require("nodemailer");
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Firestore operations
const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();

exports.razorPayDisplay = functions
    .region("asia-east2")
    .https.onRequest(async (req, res) => {
      cors(req, res, async () => {
        const {amount, currency} = req.body;
        const payment_capture = 1;
        // const amount = 500;
        // const currency = "INR";
        const options = {
          amount: Number(amount) * 100,
          currency: currency,
          receipt: shortid.generate(),
          payment_capture,
        };

        instance.orders.create(options, (err, order) => {
      order ? res.status(200).send(order) : res.status(500).send(err);
        });
      });
    });

exports.razorPayStatus = functions
    .region("asia-east2")
    .https.onRequest(async (req, res) => {
      cors(req, res, async () => {
        try {// getting the details back from our font-end
          const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
          } = req.body;
          // Creating our own digest
          // The format should be like this:
          // digest = hmac_sha256(orderCreationId + "|"
          // + razorpayPaymentId, secret);
          const shasum = crypto.createHmac("sha256",
              key_secret);

          shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

          const digest = shasum.digest("hex");
          // console.log(`digest: ${digest}
          // razorpaySignature: ${razorpaySignature}`);
          // comaparing our digest with the actual signature
          if (digest !== razorpaySignature) {
            return res.status(400).send({msg: "Transaction not legit!"});
          } else {
            res.send({
              msg: "success",
              orderId: razorpayOrderId,
              paymentId: razorpayPaymentId,
              signature: razorpaySignature,
            });
          }
        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        } catch (err) {
          console.log(err);
          res.status(500).send({msg: err.message});
        }
      });
    });

exports.submitContactForm = functions
    .region("asia-east2")
    .https.onCall(async (data, context) => {
      // console.log(`data: ${JSON.stringify(data)}`);

      try {// Checking that the user is authenticated.
        if (!context.auth) {
          // console.log(`context.auth: ${JSON.stringify(context.auth)}`);
          // Throwing an HttpsError so that the client gets the error details.
          throw new functions.https
              .HttpsError("failed-precondition",
                  "The function must be called " +
      "while authenticated.");
        } else {
          const name = context.auth.token.name || null;
          const clientEmail = context.auth.token.email || null;
          const phone = context.auth.token.phone || null;
          const mailOptions = {
            from: clientEmail,
            to: "admin@vidhavani.com",
            subject: `Contact Us Form Submission from ${clientEmail}`,
            text: `${data.message}\nFrom: ${name}\n
      Email: ${clientEmail}\nPhone: ${phone==null?"":phone}\n`,
          };

          // console.log(`mailOptions: ${JSON.stringify(mailOptions)}`);
          return await transporter.sendMail(mailOptions).then((info) => {
            console.log(`Message sent: ${info.response}`);
            return {result: "Success"};
          }).catch((error) => {
            console.error(error);
            return {result: "error"};
          });
        }
      } catch (error) {
        return {result: "Please login first"};
      }
    });


exports.createUserDetails = functions
    .region("asia-east2")
    .auth.user().onCreate(async (user) => {
      const userDetails = {
        authentication: {
          pan: "",
          passport: "",
        },
        avatar: user.photoURL || "",
        dob: "",
        email: user.email,
        id: "",
        legal_name: user.displayName || "",
        phone: user.phoneNumber || "",
        provider: "firebase",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      try {
        const userDetailsRef = firestore.collection("user_details").doc();
        userDetails.id = userDetailsRef.id;
        await userDetailsRef.set(userDetails);
        console.log("User details added to Firestore");

        // Update the "id" field of the newly created
        // document with the generated ID
        await userDetailsRef.update({id: userDetails.id});
        console.log("User details document ID updated");

        // Configure the email message
        const mailOptions = {
          from: "admin@vidhavani.com",
          to: user.email,
          cc: "admin@vidhavani.com",
          subject: "Welcome to Vidhavani!",
          // eslint-disable-next-line max-len
          html: `<p>Hi ${user.displayName},</p> <p> Welcome to Vidhavani!</p><p>Your email ${user.email} has been registered with Vidhavani. As next step, you can complete your profile for KYC details. Once profile is complete, you are all set to start your investing and asset building journey with us.</p><p>Vidhavani Team!</p>`,
        };
        // Send the email message
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
      } catch (error) {
        console.error(error);
      }
    });

// If user sign up and user details doen't exist in user_details collection
exports.checkUserDetails = functions
    .region("asia-east2").https.onCall(async (data, context) => {
      // cors(data, context, async () => {
      // Check if the user is authorized to call the function
      if (!context.auth) {
        return {result: "Please login first"};
      }

      const users = await admin.auth().listUsers();
      const userDetailsSnapshot = await firestore
          .collection("user_details").get();

      const userDetailsMap = userDetailsSnapshot.docs.reduce((map, doc) => {
        map[doc.data().email] = true;
        return map;
      }, {});

      const missingUserDetails = users.users.filter(
          (user) => !userDetailsMap[user.email]);

      if (missingUserDetails.length === 0) {
        console.log("All users present in user_details collection");
        return {result: "All users present in user_details collection"};
      }

      console.log(
          `Found ${missingUserDetails.length} users with no record`);

      const missingUserDetailsPromises = missingUserDetails.map((user) => {
        const userDetails = {
          authentication: {
            pan: "",
            passport: "",
          },
          avatar: user.photoURL || "",
          dob: "",
          email: user.email,
          id: "",
          legal_name: user.displayName || "",
          phone: user.phoneNumber || "",
          provider: "firebase",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        const userDetailsRef = firestore.collection("user_details").doc();
        userDetails.id = userDetailsRef.id;

        return userDetailsRef.set(userDetails).then(() => {
          console.log(`Added user details for ${user.email}`);

          return userDetailsRef.update({id: userDetails.id}).then(() => {
            console.log(`Updated ID for ${user.email}`);
          });
        }).catch((error) => {
          console.error(`Error adding user details for ${user.email}:`, error);
        });
      });

      try {
        await Promise.all(missingUserDetailsPromises);
        console.log("All missing user details added to Firestore");
        return {result: `Added ${missingUserDetails.length} 
        missing user details`};
      } catch (error) {
        console.error("Error adding missing user details to Firestore:",
            error);
        return {result: "error"};
      }
      // });
    });

exports.sendEmailNotification = functions
    .region("asia-east2")
    .https.onCall(async (data, context) => {
      try {
        // Enable CORS

        if (!context.auth) {
          throw new functions.https.HttpsError(
              "failed-precondition",
              "The function must be called while authenticated.",
          );
        }

        // Decode the attachment file back to binary
        let attachment;
        if (data.attachment) {
          const fileBuffer = Buffer.from(data.attachment, "base64");
          attachment = {
            filename: data.attachmentName,
            content: fileBuffer,
            contentType: "application/pdf",
          };
          // console.log("File Size:", fileBuffer.length, "bytes");
        }

        // Loop through the email array and send individual emails
        for (const email of data.emails) {
          const mailOptions = {
            from: "admin@vidhavani.com",
            to: email,
            subject: data.subject,
            html: data.htmlContent,
            attachments: attachment ? [attachment] : [],
          };
          try {
            await transporter.sendMail(mailOptions);
          } catch (e) {
            console.error(`${email} error sending email:`, e);
          }
        }

        return {result: "Success"};
      } catch (error) {
        console.error("Error sending email notification:", error);
        return {result: error};
      }
    });

// send feedback email
exports.sendFeedbackEmail = functions
    .region("asia-east2")
    .https.onCall(async (data, context) => {
      // console.log(`data: ${JSON.stringify(data)}`);

      try {// Checking that the user is authenticated.
        if (!context.auth) {
          // console.log(`context.auth: ${JSON.stringify(context.auth)}`);
          // Throwing an HttpsError so that the client gets the error details.
          throw new functions.https
              .HttpsError("failed-precondition",
                  "The function must be called " +
  "while authenticated.");
        } else {
          const name = context.auth.token.name || null;
          const clientEmail = context.auth.token.email || null;
          const mailOptions = {
            from: clientEmail,
            to: "admin@vidhavani.com",
            subject: `Feedback from ${name}`,
            text: `Like: \n${data.like}\nDislike: ${data.dislike}\n
            Investment Barrier: ${data.investmentBarrier}
            \nUnclear Features: ${data.unclearFeatures}\n
            Desired Features: ${data.desiredFeatures}\n`,
          };

          // console.log(`mailOptions: ${JSON.stringify(mailOptions)}`);
          return await transporter.sendMail(mailOptions).then((info) => {
            console.log(`Message sent: ${info.response}`);
            return {result: "Success"};
          }).catch((error) => {
            console.error(error);
            return {result: "error"};
          });
        }
      } catch (error) {
        return {result: "Please login first"};
      }
    });
