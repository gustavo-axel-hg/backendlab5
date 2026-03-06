CREATE TABLE IF NOT EXISTS carros_estacionamiento (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(20) NOT NULL,
    propietario VARCHAR(120) NOT NULL,
    marca VARCHAR(80),
    modelo VARCHAR(80),
    color VARCHAR(50),
    espacio VARCHAR(20),
    hora_entrada TIMESTAMP NOT NULL DEFAULT NOW(),
    hora_salida TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'estacionado',
    observaciones TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_estado_carro CHECK (estado IN ('estacionado', 'retirado'))
);
