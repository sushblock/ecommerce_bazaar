import React, { useState } from 'react';
import styled from 'styled-components';
import { functions } from "../../config/firebase";
import { httpsCallable } from "firebase/functions";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 300px;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
`;

function SampleLangchainInput() {
  const [title, setTitle] = useState('');
  const [era, setEra] = useState('');
  const [result, setResult] = useState('');

  const handleInputChange = (e) => {
    if (e.target.name === 'title') {
      setTitle(e.target.value);
    } else if (e.target.name === 'era') {
      setEra(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let successmessage = null;

    const sequentialChain = httpsCallable(functions, "sequentialChain");
    try {
      await sequentialChain({
        title: title,
        era: era,
        //email: email,
      }).then((result) => {
        successmessage = result.data;
      });
      setEra("");
      setTitle("");
      
      setResult(successmessage.result);
    } catch (error) {
      console.log(error);
      setResult("Something went wrong, please try again");
    }
  };

  return (
    <Container>
      <h1>Submit Title and Era</h1>
      <InputContainer>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="era"
          placeholder="Era"
          value={era}
          onChange={handleInputChange}
        />
      </InputContainer>
      <Button onClick={handleSubmit}>Submit</Button>
      {result && (
        <ResultContainer>
          <h2>Result:</h2>
          <TextArea readOnly value={result} />
        </ResultContainer>
      )}
    </Container>
  );
}

export default SampleLangchainInput;