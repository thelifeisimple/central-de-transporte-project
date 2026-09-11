import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { resultsData } from '../../utils/test-data/resultsData';

export class ResultPage extends BasePage {

    public readonly principalHeader: Locator;
    public readonly resultadoTextoIda: Locator;
    public readonly idaTexto: Locator;
    public readonly hastaTexto: Locator;
    
    constructor(page: Page) {
        super(page);
        this.principalHeader= page.locator('#LbnLogoHeader');
        this.resultadoTextoIda = page.getByText(resultsData.resultadoIda);
        this.idaTexto = page.locator('#divfix').getByText(resultsData.ciudades.buenosAiresRetiro);
        this.hastaTexto = page.locator('#divfix').getByText(resultsData.ciudades.cordoba);
    
    }
}