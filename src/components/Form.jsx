import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import validator from 'validator';
import { motion } from 'framer-motion';
import Input from './Input';
import Button from './Button';
import { saveUser } from '../services/localStorageLogin';
import cookItSimple from '../images/backgrounds/Crop_Cook-it-Simple.svg';

function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const history = useHistory();

  const inputValidation = () => {
    const emailValidation = validator.isEmail(email);
    const passwordValidation = validator.isLength(password, { min: 5 });
    if (emailValidation && passwordValidation) {
      setIsDisabled(false);
    }
  };

  const handleChange = ({ target: { value } }, setState) => {
    setState(value);
    inputValidation();
  };

  const handleSubmit = () => {
    saveUser('user', { email });
    history.push('/meals');
  };

  return (
    <form>
      <motion.div
        initial={ { scale: 0 } }
        animate={ { scale: 1 } }
        transition={ {
          type: 'spring',
          stiffness: 260,
          damping: 80,
        } }
      >
        <img
          src={ cookItSimple }
          alt=""
          style={ { width: '55vw', paddingLeft: '15px' } }
        />
      </motion.div>
      <h1>Login</h1>
      <Input
        type="email"
        name="email"
        id="email"
        placeholder="Digite seu Email"
        value={ email }
        onChange={ (e) => handleChange(e, setEmail) }
        test="email-input"
        className="input-txt"
      />

      <Input
        type="password"
        name="password"
        id="password"
        placeholder="Digite sua Senha"
        onChange={ (e) => handleChange(e, setPassword) }
        value={ password }
        test="password-input"
        className="input-txt"
      />

      <Button
        value="Entrar"
        type="button"
        test="login-submit-btn"
        disabled={ isDisabled }
        onClick={ handleSubmit }
        className="btn-login"
      />

    </form>
  );
}

export default Form;
