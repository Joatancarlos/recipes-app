import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Card from 'react-bootstrap/Card';
import Button from '../../components/Button';
import Header from '../../components/Header/Header';
import shareIcon from '../../images/shareIcon.svg';
import { getSavedRecipes } from '../../services/favoriteRecipesLocal';
import useHandleCopy from '../../services/hooks/useHandleCopy';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/FavoriteRecipes.css';

function DoneRecipes() {
  const [recipesDone, setRecipesDone] = useState([]);
  const [selectedFilter, setFilter] = useState('all');
  const handleCopy = useHandleCopy();
  const { isCopied } = useSelector((rootReducer) => rootReducer.recipeDetails);

  useEffect(() => {
    const doneRecipes = getSavedRecipes('doneRecipes');
    if (doneRecipes.length !== 0 && doneRecipes !== null) {
      try {
        setRecipesDone(doneRecipes);
      } catch (error) {
        console.error('Erro ao fazer parsing JSON:', error);
      }
    }
  }, []);

  return (
    <div>
      <Header />
      { !recipesDone.length
        ? (<p>{'You haven\'t done any recipes yet'}</p>)
        : (
          <div style={ { padding: '25px 0' } }>
            <section className="container-favorites-btns">
              { isCopied && <p>Link copied!</p>}
              <Button
                value={ <div className="container-btn-all">All</div> }
                test="filter-by-all-btn"
                onClick={ () => setFilter('all') }
              />

              <Button
                value={ <div className="container-btn-meals">Meals</div> }
                test="filter-by-meal-btn"
                onClick={ () => setFilter('meal') }
              />

              <Button
                value={ <div className="container-btn-drinks">Drinks</div> }
                test="filter-by-drink-btn"
                onClick={ () => setFilter('drink') }
              />

            </section>

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
                    <div key={ index } className="container">
                      <Card>
                        <Card.Img
                          src={ recipe.image }
                          alt=""
                        />
                        <Card.Body>
                          <Card.Title>
                            {recipe.name}
                          </Card.Title>
                          <div className="container-share-favorite-btns-done">
                            <Card.Text>
                              {new Date(recipe.doneDate).toLocaleDateString()}
                              { recipe.type !== 'drink'
                                ? `Nationality: ${recipe.nationality}-${recipe.category}`
                                : `${recipe.alcoholicOrNot}`}
                              {recipe.tags.length > 0 && recipe.tags.map((tag) => (
                                <span
                                  key={ tag }
                                  data-testid={ `${index}-${tag}-horizontal-tag` }
                                >
                                  #
                                  {tag}
                                  {' '}
                                </span>
                              ))}
                            </Card.Text>
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
                          </div>
                          <Button
                            className="btn-login btn-card"
                            value={
                              <Link
                                to={ recipe.type === 'drink'
                                  ? `/drinks/${recipe.id}`
                                  : `/meals/${recipe.id}` }
                              >
                                View Recipe
                              </Link>
                            }
                          />
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
              </section>
            )}
          </div>
        )}
    </div>
  );
}
export default DoneRecipes;
