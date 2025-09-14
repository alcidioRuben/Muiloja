const https = require('https');
const fs = require('fs');

class QuickPixelChecker {
    constructor(pixelId = '734569286044392') {
        this.pixelId = pixelId;
        this.results = {
            pixelId: pixelId,
            timestamp: new Date().toISOString(),
            checks: {}
        };
    }

    // Verificar se o pixel está ativo no Facebook
    async checkPixelStatus() {
        console.log(`🔍 Verificando status do pixel ${this.pixelId} no Facebook...`);
        
        try {
            const url = `https://www.facebook.com/tr?id=${this.pixelId}&ev=PageView&noscript=1`;
            
            return new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    this.results.checks.facebookStatus = {
                        status: res.statusCode,
                        headers: res.headers,
                        timestamp: new Date().toISOString()
                    };
                    
                    if (res.statusCode === 200) {
                        console.log(`✅ Pixel ${this.pixelId} está ativo no Facebook`);
                        resolve(true);
                    } else {
                        console.log(`⚠️ Pixel ${this.pixelId} retornou status ${res.statusCode}`);
                        resolve(false);
                    }
                }).on('error', (err) => {
                    console.log(`❌ Erro ao verificar pixel: ${err.message}`);
                    this.results.checks.facebookStatus = {
                        error: err.message,
                        timestamp: new Date().toISOString()
                    };
                    resolve(false);
                });
            });
        } catch (error) {
            console.log(`❌ Erro ao verificar status: ${error.message}`);
            return false;
        }
    }

    // Verificar configuração no código HTML
    checkHTMLConfiguration() {
        console.log(`🔍 Verificando configuração HTML do pixel...`);
        
        try {
            const htmlPath = './public/index.html';
            if (fs.existsSync(htmlPath)) {
                const htmlContent = fs.readFileSync(htmlPath, 'utf8');
                
                // Verificar se o código do pixel está presente
                const hasPixelCode = htmlContent.includes('Facebook Pixel Code');
                const hasPixelInit = htmlContent.includes(`fbq('init', '${this.pixelId}')`);
                const hasPixelScript = htmlContent.includes('fbevents.js');
                const hasNoscript = htmlContent.includes(`id=${this.pixelId}`);
                
                this.results.checks.htmlConfiguration = {
                    hasPixelCode,
                    hasPixelInit,
                    hasPixelScript,
                    hasNoscript,
                    timestamp: new Date().toISOString()
                };
                
                console.log(`✅ Código do pixel encontrado: ${hasPixelCode}`);
                console.log(`✅ Inicialização do pixel: ${hasPixelInit}`);
                console.log(`✅ Script do Facebook: ${hasPixelScript}`);
                console.log(`✅ Tag noscript: ${hasNoscript}`);
                
                return hasPixelCode && hasPixelInit && hasPixelScript && hasNoscript;
            } else {
                console.log(`❌ Arquivo HTML não encontrado em ${htmlPath}`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Erro ao verificar HTML: ${error.message}`);
            return false;
        }
    }

    // Verificar configuração no JavaScript
    checkJavaScriptConfiguration() {
        console.log(`🔍 Verificando configuração JavaScript do pixel...`);
        
        try {
            const jsPath = './public/script.js';
            if (fs.existsSync(jsPath)) {
                const jsContent = fs.readFileSync(jsPath, 'utf8');
                
                // Verificar se há eventos de rastreamento
                const hasFbqChecks = jsContent.includes('typeof fbq !== \'undefined\'');
                const hasViewContent = jsContent.includes('fbq(\'track\', \'ViewContent\'');
                const hasLead = jsContent.includes('fbq(\'track\', \'Lead\'');
                const hasInitiateCheckout = jsContent.includes('fbq(\'track\', \'InitiateCheckout\'');
                
                this.results.checks.jsConfiguration = {
                    hasFbqChecks,
                    hasViewContent,
                    hasLead,
                    hasInitiateCheckout,
                    timestamp: new Date().toISOString()
                };
                
                console.log(`✅ Verificações de fbq: ${hasFbqChecks}`);
                console.log(`✅ Evento ViewContent: ${hasViewContent}`);
                console.log(`✅ Evento Lead: ${hasLead}`);
                console.log(`✅ Evento InitiateCheckout: ${hasInitiateCheckout}`);
                
                return hasFbqChecks && hasViewContent && hasLead && hasInitiateCheckout;
            } else {
                console.log(`❌ Arquivo JavaScript não encontrado em ${jsPath}`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Erro ao verificar JavaScript: ${error.message}`);
            return false;
        }
    }

    // Verificar estrutura de arquivos
    checkFileStructure() {
        console.log(`🔍 Verificando estrutura de arquivos...`);
        
        const requiredFiles = [
            './public/index.html',
            './public/script.js',
            './public/styles.css'
        ];
        
        const fileChecks = {};
        let allFilesExist = true;
        
        requiredFiles.forEach(file => {
            const exists = fs.existsSync(file);
            fileChecks[file] = exists;
            if (!exists) allFilesExist = false;
            
            console.log(`${exists ? '✅' : '❌'} ${file}`);
        });
        
        this.results.checks.fileStructure = {
            files: fileChecks,
            allFilesExist,
            timestamp: new Date().toISOString()
        };
        
        return allFilesExist;
    }

    // Gerar relatório
    generateReport() {
        console.log('\n📋 RELATÓRIO DE VERIFICAÇÃO RÁPIDA DO PIXEL');
        console.log('=' .repeat(60));
        
        console.log(`🆔 ID do Pixel: ${this.pixelId}`);
        console.log(`⏰ Timestamp: ${this.results.timestamp}`);
        
        // Resumo dos checks
        const checks = this.results.checks;
        let totalChecks = 0;
        let passedChecks = 0;
        
        Object.keys(checks).forEach(checkType => {
            const check = checks[checkType];
            totalChecks++;
            
            if (checkType === 'facebookStatus') {
                if (check.status === 200) passedChecks++;
            } else if (checkType === 'htmlConfiguration') {
                if (check.hasPixelCode && check.hasPixelInit && check.hasPixelScript && check.hasNoscript) passedChecks++;
            } else if (checkType === 'jsConfiguration') {
                if (check.hasFbqChecks && check.hasViewContent && check.hasLead && check.hasInitiateCheckout) passedChecks++;
            } else if (checkType === 'fileStructure') {
                if (check.allFilesExist) passedChecks++;
            }
        });
        
        console.log(`\n📊 RESUMO DOS CHECKS:`);
        console.log(`✅ Aprovados: ${passedChecks}/${totalChecks}`);
        console.log(`❌ Reprovados: ${totalChecks - passedChecks}/${totalChecks}`);
        
        // Detalhes dos checks
        console.log(`\n🔍 DETALHES:`);
        
        if (checks.facebookStatus) {
            const status = checks.facebookStatus;
            if (status.status === 200) {
                console.log(`✅ Facebook Status: Pixel ativo (${status.status})`);
            } else if (status.error) {
                console.log(`❌ Facebook Status: Erro - ${status.error}`);
            } else {
                console.log(`⚠️ Facebook Status: Status ${status.status}`);
            }
        }
        
        if (checks.htmlConfiguration) {
            const html = checks.htmlConfiguration;
            console.log(`📄 HTML: ${html.hasPixelCode ? '✅' : '❌'} Código | ${html.hasPixelInit ? '✅' : '❌'} Init | ${html.hasPixelScript ? '✅' : '❌'} Script | ${html.hasNoscript ? '✅' : '❌'} Noscript`);
        }
        
        if (checks.jsConfiguration) {
            const js = checks.jsConfiguration;
            console.log(`⚙️ JavaScript: ${js.hasFbqChecks ? '✅' : '❌'} Verificações | ${js.hasViewContent ? '✅' : '❌'} ViewContent | ${js.hasLead ? '✅' : '❌'} Lead | ${js.hasInitiateCheckout ? '✅' : '❌'} Checkout`);
        }
        
        if (checks.fileStructure) {
            const files = checks.fileStructure;
            console.log(`📁 Arquivos: ${files.allFilesExist ? '✅' : '❌'} Todos os arquivos necessários`);
        }
        
        // Recomendações
        console.log(`\n💡 RECOMENDAÇÕES:`);
        
        if (passedChecks < totalChecks) {
            if (!checks.facebookStatus || checks.facebookStatus.status !== 200) {
                console.log(`  • Verificar se o pixel ${this.pixelId} está ativo no Facebook Business Manager`);
                console.log(`  • Verificar se o domínio está autorizado para este pixel`);
            }
            
            if (!checks.htmlConfiguration || !checks.htmlConfiguration.hasPixelCode) {
                console.log(`  • Verificar se o código do pixel está presente no HTML`);
                console.log(`  • Verificar se o ID do pixel está correto`);
            }
            
            if (!checks.jsConfiguration || !checks.jsConfiguration.hasFbqChecks) {
                console.log(`  • Verificar se os eventos estão sendo rastreados corretamente`);
                console.log(`  • Verificar se não há erros de JavaScript`);
            }
            
            if (!checks.fileStructure || !checks.fileStructure.allFilesExist) {
                console.log(`  • Verificar se todos os arquivos necessários estão presentes`);
                console.log(`  • Verificar se a estrutura de pastas está correta`);
            }
        } else {
            console.log(`  🎉 Pixel configurado corretamente! Todos os checks passaram.`);
            console.log(`  📱 Para testar em tempo real, abra o arquivo pixel-test.html no navegador`);
        }
        
        // Salvar relatório
        const reportPath = 'quick-pixel-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n💾 Relatório salvo em: ${reportPath}`);
    }

    // Executar todos os checks
    async runAllChecks() {
        console.log(`🚀 Iniciando verificação rápida do Facebook Pixel ${this.pixelId}\n`);
        
        // Check 1: Estrutura de arquivos
        this.checkFileStructure();
        console.log('');
        
        // Check 2: Configuração HTML
        this.checkHTMLConfiguration();
        console.log('');
        
        // Check 3: Configuração JavaScript
        this.checkJavaScriptConfiguration();
        console.log('');
        
        // Check 4: Status no Facebook
        await this.checkPixelStatus();
        console.log('');
        
        // Gerar relatório
        this.generateReport();
    }
}

// Função principal
async function main() {
    const checker = new QuickPixelChecker();
    await checker.runAllChecks();
}

// Executar se for chamado diretamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = QuickPixelChecker;
