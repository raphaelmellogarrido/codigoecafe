<?php
// Copie este arquivo pra "db_config.php" (mesma pasta) e preencha os
// valores reais. db_config.php fica FORA do Git (.gitignore) e FORA da
// pasta public/ — na Hostinger, sobe por FTP/Gerenciador de Arquivos pra
// um nível ACIMA da public_html (mesma altura dela, não dentro), então
// nem depende do .htaccess pra ficar protegido: PHP não serve arquivo
// nenhum fora da raiz web. Só precisa subir uma vez; não mexe de novo.
//
// Lido por public/api/hotmart/_conexao.php via caminho relativo
// (__DIR__ . '/../../../private/db_config.php') — se algum dia mover
// _conexao.php de pasta, ajuste esse relativo lá.
//
// Banco atual: "Clube Nutri" (u826914764_comu_nutri), clonado do banco
// original do Clube Presença (renatodepaula.com).
define('DB_HOST', 'localhost');
define('DB_USER', 'coloque_o_usuario_real_aqui');
define('DB_PASS', 'coloque_a_senha_real_aqui');
define('DB_NAME', 'coloque_o_nome_do_banco_aqui');

// Caixa comunidade@codigoecafe.com no SMTP da Hostinger (smtp.hostinger.com,
// porta 465/SSL), usada pra mandar o convite de acesso de teste (ver
// public/api/admin/teste-emails.php). Crie essa caixa e a senha no hPanel
// antes de preencher aqui. NÃO usar o painel de variáveis de ambiente da
// Hostinger pra essa senha se ela tiver caractere especial (#, \, etc.) —
// tem um bug documentado lá que corrompe/auto-escapa o valor; por isso a
// senha real fica só aqui, num arquivo fora da web root.
define('SMTP_COMUNIDADE_USER', 'comunidade@codigoecafe.com');
define('SMTP_COMUNIDADE_SENHA', 'coloque_a_senha_criada_no_hpanel_aqui');

// ATENÇÃO: este arquivo NÃO define ADMIN_SECRET (chave do painel /admin,
// ex: editar o card "Próximo encontro ao vivo" e o Acesso de Teste). Se
// não configurar em nenhum lugar, _conexao.php cai pra getenv('ADMIN_SECRET')
// e, sem isso também, ADMIN_SECRET fica '' — o que faz TODO endpoint admin
// recusar (nunca autentica com chave vazia). Configure via variável de
// ambiente no painel Hostinger, ou adicione aqui: define('ADMIN_SECRET', '...');
