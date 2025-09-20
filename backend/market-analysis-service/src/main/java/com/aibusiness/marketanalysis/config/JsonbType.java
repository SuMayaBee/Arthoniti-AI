package com.aibusiness.marketanalysis.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Objects;

/**
 * Custom Hibernate UserType to map a PostgreSQL JSONB column to a Java Object.
 * This class handles the serialization and deserialization of the AnalysisReport DTO.
 * It uses the Jackson ObjectMapper to convert between the Java object and its JSON string representation.
 */
public class JsonbType implements UserType<Object> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public int getSqlType() {
        // This corresponds to PostgreSQL's JSONB type
        return Types.OTHER;
    }

    @Override
    public Class<Object> returnedClass() {
        return Object.class;
    }

    @Override
    public boolean equals(Object x, Object y) {
        return Objects.equals(x, y);
    }

    @Override
    public int hashCode(Object x) {
        return Objects.hashCode(x);
    }

    @Override
    public Object nullSafeGet(ResultSet rs, int position, SharedSessionContractImplementor session, Object owner) throws SQLException {
        final String json = rs.getString(position);
        if (json == null) {
            return null;
        }
        try {
            return objectMapper.readValue(json, returnedClass());
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to Object", e);
        }
    }

    @Override
    public void nullSafeSet(PreparedStatement st, Object value, int index, SharedSessionContractImplementor session) throws SQLException {
        if (value == null) {
            st.setNull(index, Types.OTHER);
            return;
        }
        try {
            final String json = objectMapper.writeValueAsString(value);
            st.setObject(index, json, Types.OTHER);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert Object to JSON", e);
        }
    }

    @Override
    public Object deepCopy(Object value) {
        // A simple deep copy implementation using JSON serialization/deserialization
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.readValue(objectMapper.writeValueAsString(value), returnedClass());
        } catch (Exception e) {
            throw new RuntimeException("Failed to deep copy object", e);
        }
    }

    @Override
    public boolean isMutable() {
        return true;
    }

    @Override
    public Serializable disassemble(Object value) {
        return (Serializable) this.deepCopy(value);
    }

    @Override
    public Object assemble(Serializable cached, Object owner) {
        return this.deepCopy(cached);
    }

    @Override
    public Object replace(Object original, Object target, Object owner) {
        return this.deepCopy(original);
    }
}
