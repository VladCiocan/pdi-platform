package ro.pdi.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.auth.model.SystemSetting;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, UUID> {

    List<SystemSetting> findByCategoryAndIsActiveTrue(String category);

    Optional<SystemSetting> findByCategoryAndSettingKeyAndIsActiveTrue(String category, String settingKey);

    Optional<SystemSetting> findByCategoryAndSettingKey(String category, String settingKey);
}
