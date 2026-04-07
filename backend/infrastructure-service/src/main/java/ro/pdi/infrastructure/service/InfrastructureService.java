package ro.pdi.infrastructure.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pdi.infrastructure.model.*;
import ro.pdi.infrastructure.repository.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InfrastructureService {

    private final InfrastructureNetworkRepository networkRepository;
    private final InfrastructureAssetRepository assetRepository;
    private final InfrastructureIncidentRepository incidentRepository;

    // === Networks ===
    public List<InfrastructureNetwork> getNetworks(InfrastructureNetwork.NetworkType type) {
        if (type != null) {
            return networkRepository.findByNetworkTypeAndIsActiveTrue(type);
        }
        return networkRepository.findByIsActiveTrue();
    }

    public InfrastructureNetwork getNetworkById(UUID id) {
        return networkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Network not found: " + id));
    }

    @Transactional
    public InfrastructureNetwork createNetwork(InfrastructureNetwork network) {
        log.info("Creating network: {}", network.getName());
        return networkRepository.save(network);
    }

    @Transactional
    public InfrastructureNetwork updateNetwork(UUID id, InfrastructureNetwork updated) {
        log.info("Updating network: {}", id);
        InfrastructureNetwork existing = getNetworkById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setNetworkType(updated.getNetworkType());
        existing.setStatus(updated.getStatus());
        existing.setTotalLength(updated.getTotalLength());
        existing.setInstallationDate(updated.getInstallationDate());
        existing.setTechnicalSpecifications(updated.getTechnicalSpecifications());
        return networkRepository.save(existing);
    }

    @Transactional
    public void deleteNetwork(UUID id) {
        log.info("Soft-deleting network: {}", id);
        InfrastructureNetwork network = getNetworkById(id);
        network.setIsActive(false);
        networkRepository.save(network);
    }

    // === Assets ===
    public List<InfrastructureAsset> getAssets(UUID networkId, InfrastructureAsset.AssetType type) {
        if (networkId != null && type != null) {
            return assetRepository.findByNetworkIdAndAssetTypeAndIsActiveTrue(networkId, type);
        } else if (networkId != null) {
            return assetRepository.findByNetworkIdAndIsActiveTrue(networkId);
        } else if (type != null) {
            return assetRepository.findByAssetTypeAndIsActiveTrue(type);
        }
        return assetRepository.findByIsActiveTrue();
    }

    public InfrastructureAsset getAssetById(UUID id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found: " + id));
    }

    @Transactional
    public InfrastructureAsset createAsset(InfrastructureAsset asset) {
        log.info("Creating asset: {}", asset.getName());
        return assetRepository.save(asset);
    }

    @Transactional
    public InfrastructureAsset updateAsset(UUID id, InfrastructureAsset updated) {
        log.info("Updating asset: {}", id);
        InfrastructureAsset existing = getAssetById(id);
        existing.setName(updated.getName());
        existing.setAssetType(updated.getAssetType());
        existing.setSerialNumber(updated.getSerialNumber());
        existing.setTechnicalSpecifications(updated.getTechnicalSpecifications());
        existing.setManufacturer(updated.getManufacturer());
        existing.setModel(updated.getModel());
        existing.setInstallationDate(updated.getInstallationDate());
        existing.setWarrantyExpiry(updated.getWarrantyExpiry());
        existing.setStatus(updated.getStatus());
        existing.setObservations(updated.getObservations());
        return assetRepository.save(existing);
    }

    @Transactional
    public void deleteAsset(UUID id) {
        log.info("Soft-deleting asset: {}", id);
        InfrastructureAsset asset = getAssetById(id);
        asset.setIsActive(false);
        assetRepository.save(asset);
    }

    // === Incidents ===
    public List<InfrastructureIncident> getIncidents(
            InfrastructureIncident.IncidentStatus status,
            InfrastructureIncident.Severity severity) {
        if (status != null && severity != null) {
            return incidentRepository.findByIsActiveTrue().stream()
                    .filter(i -> i.getStatus() == status && i.getSeverity() == severity)
                    .toList();
        } else if (status != null) {
            return incidentRepository.findByStatusAndIsActiveTrue(status);
        } else if (severity != null) {
            return incidentRepository.findBySeverityAndIsActiveTrue(severity);
        }
        return incidentRepository.findByIsActiveTrue();
    }

    public InfrastructureIncident getIncidentById(UUID id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found: " + id));
    }

    @Transactional
    public InfrastructureIncident createIncident(InfrastructureIncident incident) {
        log.info("Creating incident: {} - {}", incident.getIncidentType(), incident.getSeverity());
        if (incident.getReportedAt() == null) {
            incident.setReportedAt(LocalDateTime.now());
        }
        return incidentRepository.save(incident);
    }

    @Transactional
    public InfrastructureIncident updateIncident(UUID id, InfrastructureIncident updated) {
        log.info("Updating incident: {}", id);
        InfrastructureIncident existing = getIncidentById(id);
        existing.setIncidentType(updated.getIncidentType());
        existing.setSeverity(updated.getSeverity());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setAssignedTo(updated.getAssignedTo());
        existing.setAssignedAt(updated.getAssignedAt());
        existing.setResolutionNotes(updated.getResolutionNotes());
        existing.setObservations(updated.getObservations());
        if (updated.getStatus() == InfrastructureIncident.IncidentStatus.RESOLVED && existing.getResolvedAt() == null) {
            existing.setResolvedAt(LocalDateTime.now());
        }
        return incidentRepository.save(existing);
    }

    @Transactional
    public void deleteIncident(UUID id) {
        log.info("Soft-deleting incident: {}", id);
        InfrastructureIncident incident = getIncidentById(id);
        incident.setIsActive(false);
        incidentRepository.save(incident);
    }

    // === Stats ===
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalNetworks", networkRepository.countActiveNetworks());
        stats.put("totalAssets", assetRepository.countActiveAssets());
        stats.put("newIncidents", incidentRepository.countNewIncidents());
        stats.put("inProgressIncidents", incidentRepository.countInProgressIncidents());
        return stats;
    }
}
