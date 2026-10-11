# Tests

## Running
| Command | What runs |
|---|---|
| `./mvnw test` | All unit tests. Needs no database. |
| `./mvnw test -Dtest=BookingServiceTest` | One test class. |
| `./mvnw test -Dtest='BookingServiceTest#cancelsAFuturePendingBooking'` | One test. |
| `./mvnw test -Dtest.excluded.groups=none` | Everything, including `@Tag("integration")` tests (these need MySQL running). |

## Where things go
```
src/test/java/com/beanforge/kickback/
├── booking/BookingServiceTest.java     one test class per service, same package as the service
├── payment/PaymentServiceTest.java
├── testsupport/
│   ├── TestData.java                   ready-made entities (user, cafe, unit, offer, booking, payment)
│   └── HttpAssert.java                 assertStatus(call, HttpStatus.X)
└── KickbackApplicationTests.java       full-app smoke test, tagged "integration"
```

## Adding tests for a new service
1. Create `<feature>/<Service>Test.java` in the same package as the service, under `src/test/java`.
2. Copy the template below.
3. Build objects with `TestData`, then change only the field your test is about.
4. Name tests as sentences: `cannotCancelOnceTheSessionHasStarted`, not `test3`.
5. One rule per test. Check results with AssertJ (`assertThat`), and failures with `assertStatus`.
6. If a new entity needs a builder, add it to `TestData` so every test can use it.

```java
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class SupportServiceTest {

    @Mock SupportTicketRepository ticketRepository;
    @Mock UserRepository userRepository;
    @Mock BookingRepository bookingRepository;

    SupportService service;
    Authentication auth;

    @BeforeEach
    void setUp() {
        service = new SupportService(ticketRepository, userRepository, bookingRepository);
        auth = TestData.loginAs(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(TestData.user(1L)));
        when(ticketRepository.save(any(SupportTicket.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void sixthOpenTicketIsRefused() {
        when(ticketRepository.countByUser_UserIdAndStatusIn(eq(1L), any())).thenReturn(5L);
        assertStatus(() -> service.create(auth, new CreateTicketRequest(...)), HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
```

## Conventions
- Tests that need a real database or the full Spring context get `@Tag("integration")`.
- Use dates relative to now (`LocalDate.now().plusDays(1)`), never fixed dates, so tests don't rot.
- Mock only the repositories. Don't mock the service under test or the entities.