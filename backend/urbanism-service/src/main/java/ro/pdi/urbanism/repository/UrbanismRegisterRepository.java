package ro.pdi.urbanism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.urbanism.model.UrbanismRegister;

import java.util.List;

@Repository
public interface UrbanismRegisterRepository extends JpaRepository<UrbanismRegister, java.util.UUID> {
    List<UrbanismRegister> findByRegisterType(UrbanismRegister.RegisterType type);
}