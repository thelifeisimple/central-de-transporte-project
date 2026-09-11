import { Page, Locator } from 'playwright';
import { BasePage } from '../pages-objects/basePage'
import { searchData } from '../../utils/test-data/searchData';

export class SearchPage extends BasePage {

    private readonly origenCombobox: Locator;
    private readonly origenInput: Locator;
    public readonly origenSeleccionado: Locator;
    private readonly destinoCombobox: Locator;
    private readonly destinoInput: Locator;
    public readonly destinoSeleccionado: Locator;
    public readonly radioButtonSoloIda: Locator;
    private readonly radioButtonIdaVuelta: Locator;
    public readonly fechaIdaFiled: Locator;
    public readonly fechaVueltaFiled: Locator;
    private readonly botonBuscar: Locator;
  
    constructor(page: Page) {
      super(page);
      this.origenCombobox = page.getByRole('combobox', { name: searchData.origenFiled });
      this.origenInput = page.getByRole('textbox', { name: searchData.origenFiled });
      this.origenSeleccionado = page.locator('#select2-PadOrigen-container');
      this.destinoCombobox = page.getByRole('combobox', { name: searchData.destinoFiled }); 
      this.destinoInput = page.getByRole('textbox', { name: searchData.destinoFiled });
      this.destinoSeleccionado = page.locator('#select2-PadDestino-container');
      this.radioButtonSoloIda = page.locator('.checkmark').first();
      this.radioButtonIdaVuelta = page.locator('label:nth-child(2) > .checkmark');
      this.fechaIdaFiled = page.locator('#fechaPartida');
      this.fechaVueltaFiled = page.getByRole('textbox', { name: 'Vuelta' });
      //this.cantidadDePasajeros = page.locator('#pasajeros');
      this.botonBuscar = page.getByRole('button', { name: 'Buscar' })
      //this.results =
    }
/*     selectedCiudad(nombreCiudad: string): Locator {
        return this.page.getByRole('combobox', { name: new RegExp(`\\)\\s*${nombreCiudad}`)})
    } */
    seleccionarFechaIdaBox(dia: string): Locator {
      return this.page.locator('#cdp-calendar-container').getByText(dia, { exact: true })
    }

    seleccionarFechaVueltaBox(dia: string): Locator {
      return this.page.locator('#cdp-calendar-container-regreso').getByText(dia);
    }
    
    async buscarOrigen(nombreCiudad: string) {
      await this.origenCombobox.click();
      await this.origenInput.fill(nombreCiudad);
      await this.page.keyboard.press('Enter');
    }
    
    async buscarDestino(nombreCiudad: string) {
      await this.destinoCombobox.dblclick()
      await this.destinoInput.fill(nombreCiudad);
      await this.page.keyboard.press('Enter');
    }
    
    async seleccionarSoloIda() {
      await this.radioButtonSoloIda.click();
    }
    
    async seleccionarIdaYVuelta() {
      await this.radioButtonIdaVuelta.check();
    }
    
    async selecionarFechaIda(dia:string): Promise<void> {
      await this.fechaIdaFiled.click();
      await this.seleccionarFechaIdaBox(dia).click();
    }
    
    async selecionarFechaVuelta(dia:string): Promise<void> {
      await this.fechaVueltaFiled.click()
      await this.seleccionarFechaVueltaBox(dia).click();
    }
    
    async seleccionarPasajeros(cantidadPasajeros: string): Promise<void> {
      await this.page.locator('#pasajeros').selectOption(cantidadPasajeros);
    }

  async buscarPasaje(){
     await this.botonBuscar.click();
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }
  
  async goBack(): Promise<void> {
      await this.page.goBack();
    }
  }