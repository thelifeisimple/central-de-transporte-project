import { test, expect } from '@playwright/test';
import { SearchPage } from '../../src/ui/pages-objects/searchPages';
import { searchData } from '../../src/utils/test-data/searchData';  

test('Search for a destination', async ({ page }) => {

    const searchPage = new SearchPage(page);
    await searchPage.navigateTo();
    await searchPage.buscarOrigen(searchData.wrongSearchData.number);
    await expect(page.getByRole('treeitem', { name: searchData.notFound.message })).toBeVisible();
    await searchPage.reload();
});

