package ro.pdi.tax.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ro.pdi.tax.model.TaxProperty;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaxPropertyRepository extends JpaRepository<TaxProperty, UUID> {
    
    List<TaxProperty> findByOwnerId(UUID ownerId);
    
    List<TaxProperty> findByPropertyType(TaxProperty.PropertyType propertyType);
    
    List<TaxProperty> findByOwnerIdAndIsActiveTrue(UUID ownerId);
    
    List<TaxProperty> findByCadastralNumber(String cadastralNumber);
    
    @Query("SELECT tp FROM TaxProperty tp WHERE tp.ownerId = :ownerId AND tp.propertyType = :propertyType AND tp.isActive = true")
    List<TaxProperty> findActivePropertiesByOwnerAndType(UUID ownerId, TaxProperty.PropertyType propertyType);
    
    @Query("SELECT COUNT(tp) FROM TaxProperty tp WHERE tp.ownerId = :ownerId AND tp.isActive = true")
    Long countActivePropertiesByOwner(UUID ownerId);
}