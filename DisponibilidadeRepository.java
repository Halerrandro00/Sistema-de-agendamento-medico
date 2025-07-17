import org.springframework.data.jpa.repository.JpaRepository;
import java.time.DayOfWeek;
import java.util.List;
public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Long> {

    List<Disponibilidade> findByMedicoIdAndDiaDaSemana(Long medicoId, DayOfWeek diaDaSemana);
    List<Disponibilidade> findByMedicoId(Long medicoId);
}
