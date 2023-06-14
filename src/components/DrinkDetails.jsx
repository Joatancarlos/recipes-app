import PropTypes from 'prop-types';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Button from './Button';
import MyCarousel from './Carousel';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import witheHeartIcon from '../images/whiteHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';

function DrinkDetails({ drink, drinkIngredients,
  isFavorite, progress, isDisable, copied, handleAddRecipe, handleCopy }) {
  const history = useHistory();
  const { id } = useParams();

  return (
    <div>
      { drink.length && drink.map((recipe, index) => (
        <div key={ index }>
          <img
            src={ recipe.strDrinkThumb }
            alt={ recipe.strDrink }
            data-testid="recipe-photo"
          />
          <p data-testid="recipe-title">{ recipe.strDrink }</p>
          <p data-testid="recipe-category">{ recipe.strAlcoholic }</p>
          <div>
            { drinkIngredients.map(({ ingredients, measures }, index2) => (
              <ol
                key={ index2 }
              >
                { ingredients.map((ingredient, index3) => (
                  <li
                    key={ index3 }
                    data-testid={ `${index3}-ingredient-name-and-measure` }
                  >
                    { `${ingredient} - ${measures[index3]
                      ? measures[index3] : 'to taste'}` }
                  </li>
                )) }
              </ol>
            ))}
          </div>
          <p data-testid="instructions">{ recipe.strInstructions }</p>
          <Button
            value={
              <img
                src={ shareIcon }
                alt="Compartilhar"
                data-testid="share-btn"
              />
            }
            onClick={ () => handleCopy('drink', recipe.idDrink) }
          />
          <Button
            value={
              <img
                src={ isFavorite ? blackHeartIcon : witheHeartIcon }
                alt="Favoritar"
                data-testid="favorite-btn"
              />
            }
            onClick={ () => handleAddRecipe('drink', recipe) }
          />
          { copied && <p>Link copied!</p>}
        </div>
      ))}
      <MyCarousel />
      <Button
        test="start-recipe-btn"
        value={ progress ? 'Continue Recipe' : 'Start Recipe' }
        style={ { position: 'fixed', bottom: '0' } }
        onClick={ () => history.push(`/drinks/${id}/in-progress`) }
        disabled={ isDisable }
      />
    </div>
  );
}

DrinkDetails.propTypes = {
  copied: PropTypes.bool.isRequired,
  handleCopy: PropTypes.func.isRequired,
  drink: PropTypes.shape({
    length: PropTypes.func,
    map: PropTypes.func,
  }).isRequired,
  drinkIngredients: PropTypes.shape({
    map: PropTypes.func,
  }).isRequired,
  handleAddRecipe: PropTypes.func.isRequired,
  isDisable: PropTypes.bool.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  progress: PropTypes.bool.isRequired,
};

export default DrinkDetails;
