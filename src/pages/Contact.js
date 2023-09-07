import React, { useRef } from "react";
import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";
import styled from "styled-components";

const Contact = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const message = messageRef.current.value;

    const submitContactUs = httpsCallable(functions, "submitContactUs");
    try {
      await submitContactUs({
        message: message,
        name: name,
        email: email,
      }).then((result) => {
        const data = result.data;
        console.log(data.result);
      });
      nameRef.current.value = "";
      emailRef.current.value = "";
      messageRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const Wrapper = styled.section`
    padding: 2rem 0 5rem 0;
    text-align: center;
    .container {
      margin-top: 2rem;
      text-align: center;
      padding: 0 2rem;

      .contact-form {
        max-width: 50rem;
        margin: auto;

        .contact-inputs {
          display: flex;
          flex-direction: column;
          gap: 1rem;

          input[type="text"],
          input[type="email"] {
            padding: 1rem;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-align: center;
          }

          textarea {
            padding: 1rem;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            resize: vertical;
            text-align: center;
          }

          label {
            margin-bottom: 9rem;
            font-size: 16px;
            text-align: center;
          }

          input[type="submit"] {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 10px 20px;
            margin-top: 10px;
            cursor: pointer;
            font-size: 16px;
            border-radius: 4px;
            transition: background-color 0.3s, color 0.3s, transform 0.2s;
            margin-top: 1rem;
            border: none;
            text-align: center;
            text-decoration: none;
            padding: 0.5rem 1rem;

            &:hover {
              background-color: ${({ theme }) => theme.colors.secondary};
              transform: scale(1.05);
            }

            @media screen and (max-width: 768px) {
              font-size: 1.4rem;
            }
          }
        }
      }
    }
  `;

  const ContactInfo = styled.div`
    margin-top: 2rem;
    margin-bottom: 1rem;
    display: block;
    font-size: 1.6rem;

    a {
      margin-left: 1rem;
      color: #0077b5;
      text-decoration: none;
    }
  `;

  const MapFrame = styled.iframe`
    width: 100%;
    height: 450px;
    border: 0;
  `;

  return (
    <Wrapper>
      <h2>Feel Free to Contact us</h2>

      <div className="container">
        <div className="contact-form">
          <form onSubmit={handleSubmit} className="contact-inputs">
            <input
              type="text"
              name="username"
              placeholder="Name"
              ref={nameRef}
              autoComplete="off"
              required
            />

            <input
              type="email"
              name="Email"
              placeholder="Email"
              ref={emailRef}
              autoComplete="off"
              required
            />

            <textarea
              name="message"
              cols="30"
              rows="6"
              placeholder="Your Message"
              ref={messageRef}
              autoComplete="off"
              required
            ></textarea>

            <input type="submit" value="Send Email" />
          </form>
        </div>
        <ContactInfo>
          <a
            href="https://wa.me/917827628839"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </ContactInfo>
        <MapFrame
          src="https://maps.google.com/maps?width=100%25&amp;height=450&amp;hl=en&amp;q=Vidhavani%20Enterprises,%20Sarjapura,%20Bangalore,%20Karnataka,%20India+(Vidhavani%20Enterprises)&amp;t=&amp;z=9&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></MapFrame>
      </div>
    </Wrapper>
  );
};

export default Contact;
