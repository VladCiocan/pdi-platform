package ro.pdi.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pdi.auth.model.SystemSetting;
import ro.pdi.auth.repository.SystemSettingRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SystemSettingRepository systemSettingRepository;

    public Map<String, String> getSettings(String category) {
        List<SystemSetting> settings = systemSettingRepository.findByCategoryAndIsActiveTrue(category);
        Map<String, String> result = new LinkedHashMap<>();
        for (SystemSetting setting : settings) {
            result.put(setting.getSettingKey(), setting.getSettingValue());
        }
        return result;
    }

    @Transactional
    public void saveSettings(String category, Map<String, String> settings) {
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            Optional<SystemSetting> existing = systemSettingRepository
                    .findByCategoryAndSettingKey(category, entry.getKey());

            if (existing.isPresent()) {
                SystemSetting setting = existing.get();
                setting.setSettingValue(entry.getValue());
                setting.setIsActive(true);
                systemSettingRepository.save(setting);
            } else {
                SystemSetting setting = SystemSetting.builder()
                        .category(category)
                        .settingKey(entry.getKey())
                        .settingValue(entry.getValue())
                        .isActive(true)
                        .build();
                systemSettingRepository.save(setting);
            }
        }
    }

    public String getSetting(String category, String key) {
        return systemSettingRepository.findByCategoryAndSettingKeyAndIsActiveTrue(category, key)
                .map(SystemSetting::getSettingValue)
                .orElse(null);
    }

    @Transactional
    public void deleteSetting(String category, String key) {
        systemSettingRepository.findByCategoryAndSettingKeyAndIsActiveTrue(category, key)
                .ifPresent(setting -> {
                    setting.setIsActive(false);
                    systemSettingRepository.save(setting);
                });
    }
}
