const puppeteer = require('puppeteer');
const fs = require('fs');

class FacebookPixelChecker {
    constructor(pixelId = '734569286044392') {
        this.pixelId = pixelId;
        this.results = {
            pixelLoaded: false,
            pixelInitialized: false,
            eventsTracked: [],
            errors: [],
            warnings: []
        };
    }

    async checkPixel(url) {
        console.log(`🔍 Verificando Facebook Pixel ${this.pixelId} em: ${url}`);
        
        const browser = await puppeteer.launch({
            headless: false,
            devtools: true
        });

        try {
            const page = await browser.newPage();
            
            // Interceptar requisições para detectar eventos do pixel
            await page.setRequestInterception(true);
            
            page.on('request', request => {
                if (request.url().includes('facebook.com/tr')) {
                    console.log(`📊 Evento do Pixel detectado: ${request.url()}`);
                    this.results.eventsTracked.push({
                        url: request.url(),
                        timestamp: new Date().toISOString()
                    });
                }
                request.continue();
            });

            // Interceptar console logs
            page.on('console', msg => {
                if (msg.text().includes('fbq') || msg.text().includes('Facebook')) {
                    console.log(`📝 Console: ${msg.text()}`);
                }
            });

            // Interceptar erros
            page.on('pageerror', error => {
                console.log(`❌ Erro na página: ${error.message}`);
                this.results.errors.push(error.message);
            });

            // Navegar para a página
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Aguardar o carregamento do pixel
            await page.waitForTimeout(3000);

            // Verificar se o pixel está carregado
            const pixelLoaded = await page.evaluate(() => {
                return typeof window.fbq !== 'undefined';
            });

            this.results.pixelLoaded = pixelLoaded;
            console.log(`✅ Pixel carregado: ${pixelLoaded}`);

            // Verificar se o pixel foi inicializado
            const pixelInitialized = await page.evaluate(() => {
                if (typeof window.fbq !== 'undefined') {
                    return window.fbq._fbq && window.fbq._fbq.loaded;
                }
                return false;
            });

            this.results.pixelInitialized = pixelInitialized;
            console.log(`✅ Pixel inicializado: ${pixelInitialized}`);

            // Verificar eventos na fila
            const eventsInQueue = await page.evaluate(() => {
                if (typeof window.fbq !== 'undefined' && window.fbq._fbq) {
                    return window.fbq._fbq.queue ? window.fbq._fbq.queue.length : 0;
                }
                return 0;
            });

            console.log(`📊 Eventos na fila: ${eventsInQueue}`);

            // Testar eventos manualmente
            await this.testPixelEvents(page);

            // Aguardar mais um pouco para capturar eventos
            await page.waitForTimeout(2000);

            // Gerar relatório
            this.generateReport();

        } catch (error) {
            console.error(`❌ Erro durante a verificação: ${error.message}`);
            this.results.errors.push(error.message);
        } finally {
            await browser.close();
        }
    }

    async testPixelEvents(page) {
        console.log('\n🧪 Testando eventos do pixel...');

        const events = [
            {
                name: 'PageView',
                code: 'fbq("track", "PageView");'
            },
            {
                name: 'ViewContent',
                code: 'fbq("track", "ViewContent", {content_name: "Teste", content_category: "Teste"});'
            },
            {
                name: 'Lead',
                code: 'fbq("track", "Lead", {content_category: "Teste"});'
            },
            {
                name: 'InitiateCheckout',
                code: 'fbq("track", "InitiateCheckout", {content_name: "Teste", value: 100});'
            }
        ];

        for (const event of events) {
            try {
                console.log(`📤 Testando evento: ${event.name}`);
                await page.evaluate(event.code);
                await page.waitForTimeout(500);
            } catch (error) {
                console.log(`❌ Erro ao testar ${event.name}: ${error.message}`);
            }
        }
    }

    generateReport() {
        console.log('\n📋 RELATÓRIO DE VERIFICAÇÃO DO PIXEL');
        console.log('=' .repeat(50));
        
        console.log(`🆔 ID do Pixel: ${this.pixelId}`);
        console.log(`📱 Pixel Carregado: ${this.results.pixelLoaded ? '✅ SIM' : '❌ NÃO'}`);
        console.log(`⚙️ Pixel Inicializado: ${this.results.pixelInitialized ? '✅ SIM' : '❌ NÃO'}`);
        
        console.log(`\n📊 Eventos Detectados: ${this.results.eventsTracked.length}`);
        this.results.eventsTracked.forEach((event, index) => {
            console.log(`  ${index + 1}. ${event.timestamp} - ${event.url}`);
        });

        if (this.results.errors.length > 0) {
            console.log(`\n❌ Erros Encontrados: ${this.results.errors.length}`);
            this.results.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }

        if (this.results.warnings.length > 0) {
            console.log(`\n⚠️ Avisos: ${this.results.warnings.length}`);
            this.results.warnings.forEach((warning, index) => {
                console.log(`  ${index + 1}. ${warning}`);
            });
        }

        // Recomendações
        console.log('\n💡 RECOMENDAÇÕES:');
        if (!this.results.pixelLoaded) {
            console.log('  • Verificar se o código do pixel está presente no HTML');
            console.log('  • Verificar se não há bloqueadores de script');
            console.log('  • Verificar se o domínio está autorizado no Facebook');
        }
        
        if (!this.results.pixelInitialized) {
            console.log('  • Verificar se o ID do pixel está correto');
            console.log('  • Verificar se não há erros de JavaScript');
            console.log('  • Verificar se o script do Facebook está carregando');
        }

        if (this.results.eventsTracked.length === 0) {
            console.log('  • Verificar se os eventos estão sendo disparados corretamente');
            console.log('  • Verificar se não há bloqueadores de rastreamento');
            console.log('  • Verificar se o pixel está configurado para receber eventos');
        }

        // Salvar relatório em arquivo
        const reportData = {
            timestamp: new Date().toISOString(),
            pixelId: this.pixelId,
            results: this.results
        };

        fs.writeFileSync('pixel-report.json', JSON.stringify(reportData, null, 2));
        console.log('\n💾 Relatório salvo em: pixel-report.json');
    }
}

// Função principal
async function main() {
    const checker = new FacebookPixelChecker();
    
    // Verificar o site principal
    await checker.checkPixel('http://localhost:8000');
    
    // Verificar a página de teste
    await checker.checkPixel('http://localhost:8000/pixel-test.html');
}

// Executar se for chamado diretamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = FacebookPixelChecker;
