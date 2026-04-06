package ro.pdi.urbanism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.urbanism.model.UrbanismUTR;

import java.util.List;

@Repository
public interface UrbanismUTRRepository extends JpaRepository<UrbanismUTR, java.util.UUID> {
    List<UrbanismUTR> findByIsActiveTrue();
}