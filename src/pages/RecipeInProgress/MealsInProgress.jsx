/* eslint-disable react/jsx-max-depth */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { ListGroupItem } from 'react-bootstrap';
import { fetchMealsById } from '../../services/fetchRequisition';
import 'bootstrap/dist/css/bootstrap.min.css';
import ObjectEntries from '../../services/objectEntries';
import Button from '../../components/Button';
import '../../styles/RecipeInProgress.css';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import witheHeartIcon from '../../images/whiteHeartIcon.svg';
import shareIcon from '../../images/shareIcon.svg';
import disableButton from '../../services/disableButton';

import { getSavedProgress, saveProgress } from '../../services/localStorageProgress';
import useHandleCopy from '../../services/hooks/useHandleCopy';
import useFavoriteRecipe from '../../services/hooks/useFavoriteRecipe';

export default function MealsInProgress() {
  const history = useHistory();
  const { id } = useParams();
  const { location: { pathname } } = history;
  const [disabled, setDisabled] = useState(true);
  const [checked, setChecked] = useState([]);
  const [meal, setMeal] = useState({});
  const [mealIngredients, setMealIngredients] = useState([]);
  const handleCopy = useHandleCopy();
  const { handleAddRecipe } = useFavoriteRecipe();
  const { isFavorite } = useSelector((rootReducer) => rootReducer.recipeDetails);

  useEffect(() => {
    const savedProgress = getSavedProgress('inProgressRecipes');
    if (Object.keys(savedProgress.meals).length > 0 && savedProgress.meals) {
      const progress = savedProgress.meals.find((el) => el.id === id);
      if (progress !== undefined) {
        setChecked(progress.newChecked);
        disableButton(progress.newChecked, setDisabled);
      }
    }
  }, [meal]);

  const requestDetails = async () => {
    if (pathname.includes('/meals')) {
      const mealData = await fetchMealsById(id);
      const mealItem = mealData.meals[0];
      console.log(mealItem, 'mealItem');
      const mealEntries = ObjectEntries('strIngredient', mealItem);
      const checksArr = [];
      mealEntries[0].ingredients
        .forEach(() => {
          checksArr.push(false);
          setChecked(checksArr);
        });
      setMeal([mealItem]);
      setMealIngredients(mealEntries);
    }
  };

  const handleInputChange = (indice) => {
    const newChecked = [...checked];
    newChecked[indice] = !newChecked[indice];
    setChecked(newChecked);
    disableButton(newChecked, setDisabled);
    const progressData = getSavedProgress('inProgressRecipes');
    if (Object.keys(progressData).includes('meals')) {
      let objLocalStorage;
      if (progressData.meals.some((m) => m.id === id)) {
        const newProgressData = progressData.meals.map((obj) => {
          if (obj.id === id) {
            return { ...obj, newChecked };
          }
          return obj;
        });
        objLocalStorage = {
          ...progressData,
          meals: newProgressData,
        };
      } else {
        objLocalStorage = {
          ...progressData,
          meals: [
            ...progressData.meals,
            {
              id,
              newChecked,
            },
          ],
        };
      }
      saveProgress('inProgressRecipes', objLocalStorage);
    }
  };

  const handleClick = (recipe) => {
    const doneRcp = localStorage.getItem('doneRecipes') !== null
      ? JSON.parse(localStorage.getItem('doneRecipes')) : [];
    const tags = recipe.strTags !== null ? recipe.strTags.split(',') : [];
    const newDoneRcp = [
      ...doneRcp,
      { id: recipe.idMeal,
        type: 'meal',
        nationality: recipe.strArea ? recipe.strArea : '',
        category: recipe.strCategory,
        alcoholicOrNot: '',
        name: recipe.strMeal,
        image: recipe.strMealThumb,
        doneDate: new Date(Date.now()).toISOString(),
        tags,
      },
    ];
    localStorage.setItem('doneRecipes', JSON.stringify(newDoneRcp));
    history.push('/done-recipes');
  };

  useEffect(() => {
    requestDetails();
  }, []);

  return (
    <div
      style={ { paddingTop: '1px', paddingBottom: '30px' } }
    >
      {meal.length && meal.map((recipe, index) => (
        <div key={ index }>
          <div className="container">
            <Card>
              <Card.Img
                variant="top"
                src={ recipe.strMealThumb }
                alt={ recipe.strMeal }
              />
              <Card.Body>
                <Card.Title>
                  {recipe.strMeal}
                </Card.Title>
                <Card.Text
                  style={ {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  } }
                >
                  { `Category: ${recipe.strCategory}` }
                  <div className="container-share-favorite-btns">
                    <Button
                      value={
                        <img
                          src={ shareIcon }
                          alt="Compartilhar"
                          data-testid="share-btn"
                        />
                      }
                      onClick={ () => handleCopy('meal', recipe.idMeal) }
                    />
                    <Button
                      value={
                        <img
                          src={ isFavorite ? blackHeartIcon : witheHeartIcon }
                          alt="Favoritar"
                          data-testid="favorite-btn"
                        />
                      }
                      onClick={ () => handleAddRecipe('meal', recipe) }
                    />
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>

          <div>
            { mealIngredients.map(({ ingredients, measures }, index2) => (
              <div className="container" key={ `${ingredients[index2]} index2` }>
                <ListGroup>
                  {ingredients.map((ingredient, index3) => (
                    <ListGroupItem
                      key={ `${ingredient} index3` }
                      className={ checked[index3] ? 'checked' : '' }
                    >
                      <Form.Check
                        id={ `ingredient ${index3}` }
                        checked={ checked[index3] }
                        type="checkbox"
                        label={ `${ingredient} - ${measures[index3]}` }
                        onChange={ () => handleInputChange(index3) }
                      />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </div>
            ))}
          </div>
          <div className="container">
            <Card>
              <Card.Body>
                <Card.Title>
                  Step-by-step:
                </Card.Title>
                <Card.Text>
                  { recipe.strInstructions.split('. ').map((frase) => (
                    <p key={ frase }>{ `${frase}.` }</p>
                  )) }
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <Button
            value="Done Recipe"
            test="finish-recipe-btn"
            disabled={ disabled }
            className="btn-login btn-bottom"
            onClick={ () => handleClick(recipe) }
          />
        </div>
      ))}
    </div>
  );
}
MealsInProgress.propTypes = {
  meal: PropTypes.shape({
    length: PropTypes.func,
    map: PropTypes.func,
  }),
  mealIngredients: PropTypes.shape({
    map: PropTypes.func,
  }),
};
