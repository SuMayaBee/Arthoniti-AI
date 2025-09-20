package com.aibusiness.logo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Objects;

// This class allows Hibernate to map a JSONB database column to a Java String field.
public class JsonType implements UserType<Object> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public int getSqlType() {
        return Types.JAVA_OBJECT;
    }

    @Override
    public Class<Object> returnedClass() {
        return Object.class;
    }
    // ... Boilerplate methods for the UserType interface
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
        return value; // Assuming immutability
    }

    @Override
    public boolean isMutable() {
        return false;
    }

    @Override
    public Serializable disassemble(Object value) {
        return (Serializable) value;
    }

    @Override
    public Object assemble(Serializable cached, Object owner) {
        return cached;
    }
}
