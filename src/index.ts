import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrapes the most recent exchange rate for USD (Dólar) from DNIT's website
 * @returns Promise resolving to an object with buy and sell rates
 */

const MONTHS_IN_SPANISH = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DNIT_URL = "https://www.dnit.gov.py/en/web/portal-institucional/cotizaciones";
const DAY_INDEX = 0;
const COMPRA_INDEX = 1;
const VENTA_INDEX = 2;

interface ExchangeRateResult {
  success: boolean;
  data?: {
    fecha: string;
    compra: string; 
    venta: string 
  };
  message?: string;
}

/**
 * Fetches HTML content from DNIT website
 */
async function fetchDnitHtml(): Promise<string> {
  const response = await axios.get(DNIT_URL);
  return response.data;
}

/**
 * Finds the exchange rate table based on current month and year
 */
function findExchangeRateTable($: cheerio.Root): cheerio.Cheerio {
  const month = MONTHS_IN_SPANISH[new Date().getMonth()];
  const year = new Date().getFullYear();
  const tableTitle = `Tipos de cambios del mes de ${month} ${year}`;
  
  const h4Element = $("h4.section__midtitle").filter((_, element) => 
    $(element).text().trim() === tableTitle
  );
  
  if (h4Element.length === 0) {
    throw new Error(`No se encontró tabla de cotizaciones para: ${tableTitle}`);
  }

  const tableContainer = h4Element.closest("div.component-midtitle-txt").next("div.table-responsive");
  
  if (tableContainer.length === 0) {
    throw new Error("Could not find table container after the title");
  }

  const targetTable = tableContainer.find("table");
  
  if (targetTable.length === 0) {
    throw new Error("Could not find table within container");
  }

  return targetTable;
}

/**
 * Extracts the most recent dollar exchange rate (last row) from the table
 */
function extractDollarRate(table: cheerio.Cheerio): { fecha: string; compra: string; venta: string } {
  const rows = table.find("tbody tr");
  
  if (rows.length === 0) {
    throw new Error("No rows found in the exchange rate table");
  }
  
  // Get the last row (most recent day)
  const lastRow = rows.last();
  const cells = lastRow.find("td");
  
  if (cells.length <= Math.max(COMPRA_INDEX, VENTA_INDEX)) {
    throw new Error("Last row doesn't have enough columns for exchange rate data");
  }
  const day = cells.eq(DAY_INDEX).text().trim();
  const fecha = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${day}`;
  const compra = cells.eq(COMPRA_INDEX).text().trim();
  const venta = cells.eq(VENTA_INDEX).text().trim();
  
  return { fecha, compra, venta };
}

/**
 * Main function to retrieve the latest dollar exchange rate
 */
async function getLatestDollarExchangeRate(): Promise<ExchangeRateResult> {
  try {
    const html = await fetchDnitHtml();
    const $ = cheerio.load(html);
    
    const exchangeTable = findExchangeRateTable($);
    const { fecha, compra, venta } = extractDollarRate(exchangeTable);
    
    return { 
      success: true, 
      data: { fecha, compra, venta } 
    };
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Error fetching exchange rate" 
    };
  }
}

// Execute the function and log the results
getLatestDollarExchangeRate()
  .then((result) => {
    if (!result.success) {
      console.error(result.message);
      return;
    }
    
    console.log("Latest USD exchange rate:");
    console.log(`Fecha: ${result.data?.fecha}`);
    console.log(`Compra: ${result.data?.compra}`);
    console.log(`Venta: ${result.data?.venta}`);
  })
  .catch((error) => {
    console.error("Failed to get exchange rate:", error.message);
  });
