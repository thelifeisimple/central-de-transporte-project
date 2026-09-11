//resultados de busqueda correctamente y visibles con respecto a parametros enviados
// validar busquedas con datos incorrectos, sin resultados, con datos invalidos y con volver atras 

import { test, expect } from '@playwright/test';
import { SearchPage } from '../../src/ui/pages-objects/searchPages';
import { testData } from '../../src/utils/test-data/searchData';  

test('Search for a destination', async ({ page }) => {

    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();
    await searchPage.buscarOrigen(testData.wrongSearchData.number);
    await expect(page.getByRole('treeitem', { name: 'No se encontraron resultados' })).toBeVisible();
    await searchPage.reload();
});

