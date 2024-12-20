-- Cria uma view para mostrar as vendas mensais dos clientes
CREATE OR REPLACE VIEW cliente_vendas_mensais AS
WITH meses AS (
  SELECT generate_series(
    date_trunc('month', current_date - interval '5 months'),
    date_trunc('month', current_date),
    '1 month'::interval
  ) AS mes
),
vendas_por_mes AS (
  SELECT
    v.cliente_id,
    date_trunc('month', v.data_venda) AS mes,
    SUM(v.valor_total) AS valor_total
  FROM vendas v
  WHERE v.data_venda >= date_trunc('month', current_date - interval '5 months')
  GROUP BY v.cliente_id, date_trunc('month', v.data_venda)
)
SELECT
  c.cliente_id,
  m.mes,
  COALESCE(v.valor_total, 0) AS valor_total
FROM cliente c
CROSS JOIN meses m
LEFT JOIN vendas_por_mes v ON v.cliente_id = c.cliente_id AND v.mes = m.mes
ORDER BY c.cliente_id, m.mes;
