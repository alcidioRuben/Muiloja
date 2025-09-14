# 🔍 Ferramentas de Verificação do Facebook Pixel - Multiloja

Este conjunto de ferramentas foi criado para investigar e verificar se o Facebook Pixel está bem configurado no site da Multiloja.

## 📊 Status Atual do Pixel

- **ID do Pixel**: `734569286044392`
- **Status**: ✅ Configurado e funcionando
- **Eventos Implementados**: PageView, ViewContent, Lead, InitiateCheckout

## 🛠️ Ferramentas Disponíveis

### 1. 📱 Página de Teste Interativa (`pixel-test.html`)
Uma página web interativa que permite testar todos os eventos do pixel em tempo real.

**Como usar:**
1. Abra o arquivo `pixel-test.html` no navegador
2. Clique nos botões de teste para verificar cada evento
3. Monitore o console de eventos e status dos testes

**Recursos:**
- ✅ Teste de todos os eventos principais
- 📊 Console de eventos em tempo real
- 🔍 Verificação automática de configuração
- 📋 Relatório de status dos testes

### 2. 🚀 Verificação Rápida (`quick-pixel-check.js`)
Script Node.js que verifica rapidamente a configuração do pixel sem dependências externas.

**Como usar:**
```bash
node quick-pixel-check.js
```

**Verificações realizadas:**
- 📁 Estrutura de arquivos
- 📄 Configuração HTML do pixel
- ⚙️ Configuração JavaScript dos eventos
- 🌐 Status do pixel no Facebook

### 3. 🔬 Verificação Avançada (`pixel-checker.js`)
Script Node.js com Puppeteer para verificação completa e testes em tempo real.

**Como usar:**
```bash
# Instalar dependências
npm install

# Executar verificação
npm start
```

**Recursos avançados:**
- 🌐 Navegação real no navegador
- 📊 Interceptação de requisições do pixel
- 🧪 Testes automatizados de eventos
- 📋 Relatório detalhado com screenshots

## 📋 Checklist de Verificação

### ✅ Configuração Básica
- [x] Código do pixel presente no HTML
- [x] ID do pixel correto (734569286044392)
- [x] Script do Facebook carregando
- [x] Tag noscript configurada

### ✅ Eventos Implementados
- [x] **PageView**: Carregamento da página
- [x] **ViewContent**: Visualização de produtos
- [x] **Lead**: Submissão de formulários
- [x] **InitiateCheckout**: Início do processo de compra

### ✅ Verificações Técnicas
- [x] Função `fbq` disponível globalmente
- [x] Verificações de segurança (`typeof fbq !== 'undefined'`)
- [x] Parâmetros corretos nos eventos
- [x] Moeda e valores configurados (MZN)

## 🚨 Problemas Comuns e Soluções

### ❌ Pixel não carrega
**Possíveis causas:**
- Bloqueadores de script (AdBlock, uBlock)
- Domínio não autorizado no Facebook
- Erros de JavaScript na página

**Soluções:**
- Verificar console do navegador para erros
- Confirmar autorização do domínio no Facebook Business Manager
- Testar em modo incógnito

### ❌ Eventos não são enviados
**Possíveis causas:**
- Função `fbq` não disponível
- Erros de JavaScript
- Bloqueadores de rastreamento

**Soluções:**
- Verificar se `typeof fbq !== 'undefined'` antes de usar
- Testar eventos manualmente no console
- Verificar se o pixel está ativo no Facebook

### ❌ Pixel não inicializa
**Possíveis causas:**
- ID do pixel incorreto
- Script do Facebook não carrega
- Conflitos de JavaScript

**Soluções:**
- Confirmar ID do pixel no Facebook Business Manager
- Verificar se `fbevents.js` está carregando
- Testar em ambiente limpo

## 📱 Como Testar Manualmente

### 1. Console do Navegador
```javascript
// Verificar se o pixel está carregado
console.log(typeof fbq);

// Testar evento manualmente
fbq('track', 'ViewContent', {
    content_name: 'Teste',
    content_category: 'Teste'
});
```

### 2. Ferramentas de Desenvolvedor
- **Network Tab**: Procurar por requisições para `facebook.com/tr`
- **Console Tab**: Verificar erros de JavaScript
- **Application Tab**: Verificar se o pixel está no localStorage

### 3. Facebook Pixel Helper
- Instalar extensão "Facebook Pixel Helper" no Chrome
- Navegar pelo site para ver eventos em tempo real
- Verificar se todos os eventos estão sendo disparados

## 📊 Monitoramento Contínuo

### Relatórios Gerados
- `quick-pixel-report.json`: Relatório da verificação rápida
- `pixel-report.json`: Relatório detalhado da verificação avançada

### Métricas Importantes
- **Taxa de carregamento**: % de páginas onde o pixel carrega
- **Taxa de eventos**: % de eventos enviados com sucesso
- **Tempo de resposta**: Latência entre ação e envio do evento

## 🔧 Manutenção

### Verificações Recomendadas
- **Diária**: Verificar se o pixel está carregando
- **Semanal**: Testar eventos principais
- **Mensal**: Verificar relatórios do Facebook Business Manager

### Atualizações
- Manter scripts atualizados
- Verificar compatibilidade com novas versões do Facebook
- Testar em diferentes navegadores e dispositivos

## 📞 Suporte

Para dúvidas ou problemas com o pixel:
1. Executar verificação rápida: `node quick-pixel-check.js`
2. Verificar relatórios gerados
3. Testar com página de teste interativa
4. Consultar documentação do Facebook Pixel

---

**Desenvolvido para Multiloja** 🏪  
**Última atualização**: $(date)  
**Versão**: 1.0.0
