import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import Button from '../../components/Button';

import '../../styles/Profile.css';
import { getSavedUser, removeUser } from '../../services/localStorageLogin';

function Profile() {
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    const storedUser = getSavedUser('user');
    const { email } = storedUser;
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    history.push('/');
    removeUser('user');
  };

  return (
    <div className="profile">
      <Header />
      <div className="page-title">
        <h1
          data-testid="page-title"
        >
          Profiles
        </h1>
      </div>
      <section>
        { userEmail
        && (
          <p data-testid="profile-email">
            { userEmail }
          </p>)}

        <Button
          onClick={ () => history.push('/done-recipes') }
          test="profile-done-btn"
          value="Done Recipes"
        />
        <Button
          onClick={ () => history.push('/favorite-recipes') }
          test="profile-favorite-btn"
          value="Favorite Recipes"
        />
        <Button
          onClick={ handleLogout }
          test="profile-logout-btn"
          value="Logout"
        />
      </section>
      <Footer />
    </div>
  );
}

export default Profile;
