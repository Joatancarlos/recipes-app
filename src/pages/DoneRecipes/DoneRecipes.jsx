import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Button from '../../components/Button';
import Header from '../../components/Header/Header';
import shareIcon from '../../images/shareIcon.svg';
import { getSavedRecipes } from '../../services/favoriteRecipesLocal';

function DoneRecipes() {
  const [recipesDone, setRecipesDone] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedFilter, setFilter] = useState('all');

  const handleCopy = (type, id) => {
    let textToCopy;
    const countTimeOut = 3000;
    if (type === 'drink') {
      textToCopy = `http://localhost:3000/drinks/${id}`;
    }
    textToCopy = `http://localhost:3000/meals/${id}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, countTimeOut);
        console.log('Link copied!');
      })
      .catch((error) => {
        console.error('Erro ao copiar o texto:', error);
      });
  };

  useEffect(() => {
    const doneRecipes = getSavedRecipes('doneRecipes');
    if (doneRecipes !== '[]' && doneRecipes !== null) {
      try {
        setRecipesDone(JSON.parse(doneRecipes));
      } catch (error) {
        console.error('Erro ao fazer parsing JSON:', error);
      }
    }
  }, []);

  // useEffect(() => {
  //   const doneRecipes = localStorage.getItem('doneRecipes');
  //   if (doneRecipes !== null) {
  //     setRecipesDone(JSON.parse(doneRecipes));
  //   }
  // }, []);

  return (
    <div>
      <Header />
      <div className="page-title">
        <h1
          data-testid="page-title"
        >
          Done Recipes
        </h1>
      </div>
      <Button
        value="All"
        test="filter-by-all-btn"
        onClick={ () => setFilter('all') }
      />
      <Button
        value="Meals"
        test="filter-by-meal-btn"
        onClick={ () => setFilter('meal') }
      />
      <Button
        value="Drinks"
        test="filter-by-drink-btn"
        onClick={ () => setFilter('drink') }
      />
      { recipesDone.length
&& (
  <section>
    {recipesDone.length && recipesDone.filter((recipe) => {
      if (selectedFilter === 'all') {
        return true;
      }
      return recipe.type === selectedFilter;
    })
      .map((recipe, index) => (
        <div key={ index }>
          <Link
            to={ recipe.type === 'drink'
              ? `/drinks/${recipe.id}`
              : `/meals/${recipe.id}` }
          >
            <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
            <img
              src={ recipe.image }
              alt=""
              data-testid={ `${index}-horizontal-image` }
            />
          </Link>
          <p
            data-testid={ `${index}-horizontal-done-date` }
          >
            {recipe.doneDate}
          </p>
          <p
            data-testid={ `${index}-horizontal-top-text` }
          >
            { recipe.type !== 'drink'
              ? `${recipe.nationality} - ${recipe.category}`
              : `${recipe.alcoholicOrNot}`}
          </p>
          {recipe.tags.length && recipe.tags.map((tag) => (
            <span
              key={ tag }
              data-testid={ `${index}-${tag}-horizontal-tag` }
            >
              #
              {tag}
              {' '}
            </span>
          ))}
          <Button
            value={
              <img
                src={ shareIcon }
                alt="Compartilhar"
                data-testid={ `${index}-horizontal-share-btn` }
              />
            }
            onClick={ () => handleCopy(recipe.type, recipe.id) }
          />
          { copied && <p>Link copied!</p>}
        </div>
      ))}
  </section>
)}
    </div>
  );
}
export default DoneRecipes;
