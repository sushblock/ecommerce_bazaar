/* eslint-disable camelcase */
const functions = require("firebase-functions");
const cors = require("cors")();

const shortid = require("shortid");
const Razorpay = require("razorpay");
// Initialize Razorpay instance
// configuration set cmd firebase functions:config:set gmail.email="...." etc
const key_id = functions.config().rzp.key_id;
const key_secret = functions.config().rzp.key_secret;

console.log(`key_id --> ${key_id}`);
console.log(`key_secret --> ${key_secret}`);

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
        console.log(`amount --> ${Number(amount
            .toFixed(2) * 100)} --> ${currency}`);
        const payment_capture = 1;
        // const amount = 500;
        // const currency = "INR";
        const options = {
          amount: Number(amount.toFixed(2) * 100),
          currency: currency,
          receipt: shortid.generate(),
          payment_capture,
        };

        try {
          const order = await new Promise((resolve, reject) => {
            instance.orders.create(options, (err, order) => {
              if (err) {
                reject(err);
              } else {
                resolve(order);
              }
            });
          });

          res.status(200).send(order);
        } catch (err) {
          res.status(500).send(err);
        }
      });
    });

exports.razorPayStatus = functions
    .region("asia-east2")
    .https.onRequest(async (req, res) => {
      cors(req, res, async () => {
        try {
        // getting the details back from our font-end
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
          const shasum = crypto.createHmac("sha256", key_secret);

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

exports.createUserDetails = functions
    .region("asia-east2")
    .auth.user()
    .onCreate(async (user) => {
      const userDetails = {
        avatar: user.photoURL || "",
        email: user.email,
        id: user.uid,
        legal_name: user.displayName || "",
        phone: user.phoneNumber || "",
        provider: "firebase",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      try {
        const userDetailsRef = firestore.collection("users").doc();
        await userDetailsRef.set(userDetails);
        console.log("User details added to Firestore");

        // Update the "id" field of the newly created
        // document with the generated ID
        // await userDetailsRef.update({id: userDetails.id});
        // console.log("User details document ID updated");

        // Configure the email message
        const mailOptions = {
          from: "admin@vidhavani.com",
          to: user.email,
          cc: "admin@vidhavani.com",
          subject: "Welcome to Vidhavani!",
          // eslint-disable-next-line max-len
          html: `<p>Hi ${user.email},</p> <p> Welcome to Vidhavani Farming Solutions and Services (VFSS)!</p><p>Your email ${user.email} has been registered with Vidhavani. You can contact us for any consultancy or farming solution and services on whatsapp. We will get back to you soon.</p><p>Vidhavani Team!</p><p>+91-7827628839</p>`,
        };
        // Send the email message
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
      } catch (error) {
        console.error(error);
      }
    });

exports.submitContactUs = functions
    .region("asia-east2")
    .https.onCall(async (data, context) => {
      // console.log(`data: ${JSON.stringify(data)}`);

      try {// Checking that the user is authenticated.
        const name = data.name || null;
        // const clientEmail = data.email || null;
        const mailOptions = {
          from: context.auth?.token.email || "",
          to: "admin@vidhavani.com",
          subject: `Contact Us Form Submission from 
          ${context.auth?.token.email}`,
          text: `${data.message}\nFrom: ${name}\n
      Email: ${context.auth?.token.email}`,
        };
        // console.log(`mailOptions: ${JSON.stringify(mailOptions)}`);
        return await transporter.sendMail(mailOptions).then((info) => {
          console.log(`Message sent: ${info.response}`);
          return {result: "Success"};
        }).catch((error) => {
          console.error(error);
          return {result: "error"};
        });
      } catch (error) {
        return {result: "Some Issues"};
      }
    });
