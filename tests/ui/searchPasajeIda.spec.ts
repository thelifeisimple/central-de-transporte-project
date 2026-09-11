//resultados de busqueda correctamente y visibles con respecto a parametros enviados
// validar busquedas con datos incorrectos, sin resultados, con datos invalidos y con volver atras 

import { test, expect } from '@playwright/test';
import { SearchPage } from '../../src/ui/pages-objects/searchPages';
import { searchData } from '../../src/utils/test-data/searchData';  
import { ResultPage } from '../../src/ui/pages-objects/resultsPages';

test('Busqueda pasaje ida', async ({ page }) => {
    const fechaIda= '20';
    const textCantidadPasajero = '2'

    const searchPage = new SearchPage(page);
    const resultsPage = new ResultPage(page);
    await searchPage.navigateTo();
    await searchPage.buscarOrigen(searchData.ciudades.buenosAiresRetiro);
    await expect (searchPage.origenSeleccionado).toHaveText(searchData.ciudades.buenosAiresRetiro);
    await searchPage.buscarDestino( searchData.ciudades.cordobaCapital);
    await expect (searchPage.destinoSeleccionado).toHaveText(searchData.ciudades.cordobaCapital);
    await searchPage.seleccionarSoloIda();
    await expect (searchPage.radioButtonSoloIda).toBeChecked();
    await searchPage.selecionarFechaIda(fechaIda);
    await searchPage.seleccionarPasajeros(textCantidadPasajero);
    await searchPage.buscarPasaje();
    await resultsPage.principalHeader.waitFor()
    await expect(resultsPage.resultadoTextoIda).toBeVisible();
    await expect(resultsPage.idaTexto).toBeVisible();
    await expect(resultsPage.hastaTexto).toBeVisible();
    await resultsPage.principalHeader.click();
});

