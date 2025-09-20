package com.aibusiness.website.config;

// This is the same reusable JsonbType class used in the other services.
// It's required for Hibernate to correctly handle the JSONB data type in PostgreSQL.
// ... (code omitted for brevity, as it's a direct copy from previous responses) ...
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Objects;

public class JsonbType implements UserType<Object> {

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    public int getSqlType() {
        return Types.JAVA_OBJECT;
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
        } catch (Exception ex) {
            throw new RuntimeException("Failed to convert JSON to " + returnedClass().getName(), ex);
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
        } catch (Exception ex) {
            throw new RuntimeException("Failed to convert " + returnedClass().getName() + " to JSON", ex);
        }
    }

    @Override
    public Object deepCopy(Object value) {
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
}
