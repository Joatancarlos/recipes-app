/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useFetch from '../services/hooks/useFetch';
import { fetchRecipe,
  fetchMealsByCategory,
  fetchMeals,
  fetchMealsByName,
  fetchMealsByFirstLetter,
} from '../services/fetchRequisition';
import Button from './Button';

function RecipesMeals() {
  const [recipesMeals, setRecipesMeals] = useState({});
  const [recipesMealsByCategories, setRecipesMealsByCategories] = useState([]);
  const [category, setCategory] = useState('All');
  const { fetchData } = useFetch();
  const { searchValue, radioValue } = useSelector((rootReducer) => rootReducer.searchBar);
  const history = useHistory();

  const fetchSearchs = async () => {
    const URLmeals = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    switch (radioValue) {
    case '':
      await fetchData(fetchRecipe(URLmeals), setRecipesMeals);
      break;
    case 'ingredient':
      await fetchData(fetchMeals(searchValue), setRecipesMeals);
      break;
    case 'name':
      await fetchData(fetchMealsByName(searchValue), setRecipesMeals);
      break;
    default:
      await fetchData(fetchMealsByFirstLetter(searchValue), setRecipesMeals);
      break;
    }
  };

  const renderCondition = () => {
    console.log(recipesMeals.meals);
    if (recipesMeals.meals !== undefined) {
      if (recipesMeals.meals === null) {
        return global.alert('Sorry, we haven\'t found any recipes for these filters.');
      }
      if (recipesMeals.meals.length === 1 && recipesMeals.meals !== null) {
        history.push(`/meals/${recipesMeals.meals[0].idMeal}`);
      }
    }
  };

  // const fetchRecipesByMeals = async () => {
  //   const URLmeals = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  //   await fetchData(fetchRecipe(URLmeals), setRecipesMeals);
  // };

  const fetchRecipesByMealsByCategories = async () => {
    const URLmeals = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
    const response = await fetchRecipe(URLmeals);
    const modifiedData = [{ strCategory: 'All' }, ...response.meals];
    setRecipesMealsByCategories(modifiedData);
  };

  const filterByMeals = async (categories) => {
    const recipesMealsByCategory = fetchMealsByCategory(categories);
    await fetchData(recipesMealsByCategory, setRecipesMeals);
  };

  const toggleFilter = (categories) => {
    setCategory(categories);
    if (categories === category) {
      setCategory(categories);
    }

    if (categories === 'All' || category === categories) {
      fetchRecipesByMeals();
    } else {
      filterByMeals(categories);
    }
  };

  useEffect(() => {
    renderCondition();
  }, [recipesMeals]);

  useEffect(() => {
    // fetchRecipesByMeals();
    fetchRecipesByMealsByCategories();
    fetchSearchs();
    // renderCondition();
  }, [searchValue]);
  return (
    <div>
      <div>
        <div>
          {recipesMealsByCategories !== undefined
          && recipesMealsByCategories.map((recipe, index) => {
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
        {recipesMeals.meals
         && recipesMeals.meals.map((recipe, index) => {
           const maxRecipes = 11;
           if (index <= maxRecipes) {
             return (
               <Link
                 to={ `/meals/${recipe.idMeal}` }
                 key={ recipe.idMeal }
               >
                 <div
                   data-testid={ `${index}-recipe-card` }
                 >

                   <h1
                     data-testid={ `${index}-card-name` }
                   >
                     {recipe.strMeal}
                   </h1>

                   <img
                     src={ recipe.strMealThumb }
                     alt={ recipe.strMeal }
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

export default RecipesMeals;
