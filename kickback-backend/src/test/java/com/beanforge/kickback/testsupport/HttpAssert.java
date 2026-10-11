package com.beanforge.kickback.testsupport;

import org.assertj.core.api.ThrowableAssert.ThrowingCallable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** Checks that a service call fails with a given HTTP status, which is how this app reports rule violations. */
public final class HttpAssert {

    private HttpAssert() {}

    /** {@code assertStatus(() -> service.cancelBooking(auth, 1L), HttpStatus.BAD_REQUEST);} */
    public static void assertStatus(ThrowingCallable call, HttpStatus expected) {
        assertThatThrownBy(call).isInstanceOfSatisfying(ResponseStatusException.class,
                e -> assertThat(e.getStatusCode().value()).isEqualTo(expected.value()));
    }
}