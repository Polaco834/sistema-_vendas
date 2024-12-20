-- Cria uma view para mostrar os detalhes dos clientes
DROP VIEW IF EXISTS cliente_detalhes;

CREATE VIEW cliente_detalhes AS
WITH vendas_totais AS (
  SELECT 
    cliente_id,
    COALESCE(SUM(valor_total), 0::numeric) as total_vendido
  FROM vendas
  GROUP BY cliente_id
),
parcelas_abertas AS (
  SELECT 
    v.cliente_id,
    COALESCE(SUM(CASE WHEN p.pago = false THEN p.valor ELSE 0::numeric END), 0::numeric) as total_aberto,
    COALESCE(SUM(CASE WHEN p.data_vencimento < CURRENT_DATE AND p.pago = false THEN p.valor ELSE 0::numeric END), 0::numeric) as total_vencido
  FROM vendas v
  LEFT JOIN parcelas p ON p.venda_id = v.id
  GROUP BY v.cliente_id
)
SELECT
  c.id as cliente_id,
  c.nome,
  c.limite_compra,
  c.proxima_visita,
  COALESCE(vt.total_vendido, 0::numeric) as total_vendido,
  COALESCE(pa.total_aberto, 0::numeric) as total_aberto,
  COALESCE(pa.total_vencido, 0::numeric) as total_vencido,
  c.limite_compra - COALESCE(pa.total_aberto, 0::numeric) as saldo_limite_credito
FROM clientes c
LEFT JOIN vendas_totais vt ON vt.cliente_id = c.id
LEFT JOIN parcelas_abertas pa ON pa.cliente_id = c.id;
