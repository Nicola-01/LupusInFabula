# `dev.busato.lupus` — radice dell'applicazione

Qui c'è `LupusApplication`, il punto di partenza. Ogni sotto-cartella è uno **strato**
dell'applicazione e ha il suo README.

```
HTTP ──► controller ──► service ──► repository ──► database
            │              │             │
           dto ◄─ mappers ─┘           model (@Entity)
```

| Cartella      | Contiene                                      | Annotazione principale |
|---------------|-----------------------------------------------|------------------------|
| `controller/` | endpoint HTTP                                 | `@RestController`      |
| `service/`    | logica di business, transazioni               | `@Service`             |
| `repository/` | accesso al database                           | `@Repository`          |
| `model/`      | entity JPA = tabelle                          | `@Entity` (non è un bean) |
| `dto/`        | JSON in ingresso/uscita                       | `record` (non è un bean) |
| `mappers/`    | conversione entity → DTO                      | `@Component`           |

Regola: ogni strato chiama solo quello sotto. Il controller non tocca il repository, il
repository non sa nulla di HTTP.

---

## Cos'è un bean

Un **bean** è un oggetto **creato e gestito da Spring**, invece che da te con `new`.

All'avvio Spring crea un contenitore (*ApplicationContext*) e ci mette dentro un'istanza di ogni
classe registrata. Quando una classe ha bisogno di un'altra la chiede nel costruttore e Spring
gliela passa: è la **dependency injection**.

```java
@Service
@RequiredArgsConstructor           // Lombok: costruttore con i campi final
public class RoleService {
  private final RoleMapper roleMapper;           // ← Spring passa il bean
}
```

Nessuno scrive mai `new RoleService(...)`: all'avvio Spring risolve le dipendenze nell'ordine
giusto (prima repository e mapper, poi service, poi controller).

### Come si registra un bean

1. **Annotazione sulla classe**, trovata automaticamente:
   `@Component`, `@Service`, `@Repository`, `@RestController`, `@Configuration`.
   Sono tutte varianti di `@Component`; il nome dice lo strato a chi legge (e alcune aggiungono
   comportamento, es. `@Repository` traduce le eccezioni SQL).
2. **Metodo `@Bean` in una classe `@Configuration`**: per oggetti di librerie esterne, che non
   puoi annotare. Es. `@Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }`.
3. **Auto-configurazione di Spring Boot**: in base alle dipendenze del `pom.xml` Boot crea da solo
   `DataSource`, Jackson (`ObjectMapper`), Tomcat, il `TransactionManager`... Non li dichiari ma
   puoi farteli iniettare.

### Come Spring trova le classi: `@SpringBootApplication`

`@SpringBootApplication` = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`.
`@ComponentScan` cerca bean **in questo package e nei sotto-package**. Per questo
`LupusApplication` sta qui alla radice, e ogni nuova classe va in `dev.busato.lupus.qualcosa`:
una classe fuori da qui non viene trovata, senza nessun errore.

### Cose da sapere

- **Singleton**: di default c'è **una sola istanza** di ogni bean, condivisa da tutte le
  richieste (che arrivano su thread diversi). Quindi un bean non deve salvare nei campi dati di
  una singola richiesta: solo dipendenze `final`.
- **Proxy**: `@Transactional`, `@PreAuthorize`, `@Cacheable`, `@Async` funzionano perché Spring
  mette davanti al bean un oggetto "proxy" che fa il lavoro extra (apre la transazione, controlla
  i permessi) e poi chiama il metodo vero. Conseguenze:
  - su un oggetto creato con `new` queste annotazioni **non fanno niente**;
  - un metodo che chiama un altro metodo **della stessa classe** salta il proxy (`this.metodo()`),
    quindi l'annotazione del secondo metodo viene ignorata.
- **Iniezione dal costruttore** (`private final` + `@RequiredArgsConstructor`) è il modo
  consigliato: le dipendenze sono obbligatorie, immutabili e nei test le passi a mano o con
  Mockito. Evita `@Autowired` sui campi.
- **Dipendenze circolari** (A ha bisogno di B e B di A) fanno fallire l'avvio: è un segnale che
  la logica va spostata.
- Cosa **non** è un bean: entity (`model/`) e DTO (`dto/`). Sono dati, ne crei quanti ne servono
  con `new` / builder / Hibernate.

### Nei test

- Test unitario (`@ExtendWith(MockitoExtension.class)`): niente Spring, niente bean. Crei la
  classe con `@InjectMocks` passandole `@Mock`. Veloce.
- `@WebMvcTest`, `@DataJpaTest`: Spring crea **solo** i bean di uno strato.
- `@SpringBootTest`: Spring crea **tutti** i bean, come all'avvio vero (serve il database).
- `@MockitoBean`: sostituisce un bean del contesto con un mock.
