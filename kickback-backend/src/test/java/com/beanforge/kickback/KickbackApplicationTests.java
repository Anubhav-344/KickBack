package com.beanforge.kickback;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Starts the whole app, so it needs MySQL running. Tagged "integration" so a plain
 * ./mvnw test skips it; run it with: ./mvnw test -Dtest.excluded.groups=none
 */
@Tag("integration")
@SpringBootTest
class KickbackApplicationTests {

	@Test
	void contextLoads() {
	}

}