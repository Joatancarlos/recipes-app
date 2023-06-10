/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useFetch from '../services/hooks/useFetch';
import { fetchRecipe,
  fetchDrinksByCategory,
  fetchDrinks,
  fetchDrinksByName,
  fetchDrinksByFirstLetter,
} from '../services/fetchRequisition';
import Button from './Button';

function RecipesDrinks() {
  const [recipesDrinks, setRecipesDrinks] = useState({});
  const [recipesDrinksByCategories, setRecipesDrinksByCategories] = useState([]);
  const [category, setCategory] = useState('All');
  const { searchValue, radioValue } = useSelector((rootReducer) => rootReducer.searchBar);
  const { fetchData } = useFetch();
  const history = useHistory();

  const fetchSearchs = async () => {
    const URLmeals = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    switch (radioValue) {
    case '':
      await fetchData(fetchRecipe(URLmeals), setRecipesDrinks);
      break;
    case 'ingredient':
      await fetchData(fetchDrinks(searchValue), setRecipesDrinks);
      break;
    case 'name':
      await fetchData(fetchDrinksByName(searchValue), setRecipesDrinks);
      break;
    default:
      await fetchData(fetchDrinksByFirstLetter(searchValue), setRecipesDrinks);
      break;
    }
  };

  const fetchRecipesByDrinks = async () => {
    const URLdrinks = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    await fetchData(fetchRecipe(URLdrinks), setRecipesDrinks);
  };

  const fetchRecipesByDrinksByCategories = async () => {
    const URLdrinks = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
    const response = await fetchRecipe(URLdrinks);
    const modifiedData = [{ strCategory: 'All' }, ...response.drinks];
    setRecipesDrinksByCategories(modifiedData);
  };

  const filterByDrinks = async (categories) => {
    const recipesDrinksByCategory = fetchDrinksByCategory(categories);
    await fetchData(recipesDrinksByCategory, setRecipesDrinks);
  };

  const renderCondition = () => {
    if (recipesDrinks.drinks !== undefined) {
      if (recipesDrinks.drinks === null) {
        return global.alert('Sorry, we haven\'t found any recipes for these filters.');
      }
      if (recipesDrinks.drinks.length === 1 && recipesDrinks.drinks !== null) {
        history.push(`/drinks/${recipesDrinks.drinks[0].idDrink}`);
      }
    }
  };

  useEffect(() => {
    renderCondition();
  }, [recipesDrinks]);

  useEffect(() => {
    fetchSearchs();
    fetchRecipesByDrinksByCategories();
  }, [searchValue]);

  const toggleFilter = (categories) => {
    setCategory(categories);
    if (categories === category) {
      setCategory(categories);
    }

    if (categories === 'All' || category === categories) {
      fetchRecipesByDrinks();
    } else {
      filterByDrinks(categories);
    }
  };

  return (
    <div>
      <div>
        <div>
          {recipesDrinksByCategories !== undefined
          && recipesDrinksByCategories.map((recipe, index) => {
            const maxCategories = 5;
            if (index <= maxCategories) {
              return (
                <Button
                  key={ recipe.strCategory }
                  value={ recipe.strCategory }
                  test={ recipe.strCategory !== 'All'
                    ? `${recipe.strCategory}-category-filter`
                    : 'All-category-filter' }
                  onClick={ () => toggleFilter(recipe.strCategory) }
                />
              );
            }
            return null;
          })}
        </div>
        {recipesDrinks.drinks
          && recipesDrinks.drinks.map((recipe, index) => {
            const maxRecipes = 11;
            if (index <= maxRecipes) {
              return (
                <Link
                  to={ `/drinks/${recipe.idDrink}` }
                  key={ recipe.idDrink }
                >
                  <div
                    data-testid={ `${index}-recipe-card` }
                  >
                    <h1
                      data-testid={ `${index}-card-name` }
                    >
                      {recipe.strDrink}
                    </h1>

                    <img
                      src={ recipe.strDrinkThumb }
                      alt={ recipe.strDrink }
                      data-testid={ `${index}-card-img` }
                    />

                  </div>
                </Link>
              );
            }
            return null;
          })}

      </div>
    </div>
  );
}

export default RecipesDrinks;
