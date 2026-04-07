package ro.pdi.agriculture.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pdi.agriculture.model.*;
import ro.pdi.agriculture.repository.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgricultureService {

    private final AgricultureHouseholdRepository householdRepository;
    private final AgricultureParcelRepository parcelRepository;
    private final AgricultureMemberRepository memberRepository;
    private final AgricultureAnimalRepository animalRepository;
    private final AgricultureMachineRepository machineRepository;

    // === Households ===
    public List<AgricultureHousehold> getHouseholds(UUID ownerId) {
        if (ownerId != null) {
            return householdRepository.findByOwnerIdAndIsActiveTrue(ownerId);
        }
        return householdRepository.findByIsActiveTrue();
    }

    public AgricultureHousehold getHouseholdById(UUID id) {
        return householdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Household not found: " + id));
    }

    @Transactional
    public AgricultureHousehold createHousehold(AgricultureHousehold household) {
        log.info("Creating household: {}", household.getOwnerName());
        return householdRepository.save(household);
    }

    @Transactional
    public AgricultureHousehold updateHousehold(UUID id, AgricultureHousehold updated) {
        log.info("Updating household: {}", id);
        AgricultureHousehold existing = getHouseholdById(id);
        existing.setOwnerName(updated.getOwnerName());
        existing.setAddressId(updated.getAddressId());
        existing.setRegistrationDate(updated.getRegistrationDate());
        return householdRepository.save(existing);
    }

    @Transactional
    public void deleteHousehold(UUID id) {
        log.info("Soft-deleting household: {}", id);
        AgricultureHousehold household = getHouseholdById(id);
        household.setIsActive(false);
        householdRepository.save(household);
    }

    // === Parcels ===
    public List<AgricultureParcel> getParcels(UUID householdId) {
        if (householdId != null) {
            return parcelRepository.findByHouseholdIdAndIsActiveTrue(householdId);
        }
        return parcelRepository.findByIsActiveTrue();
    }

    public AgricultureParcel getParcelById(UUID id) {
        return parcelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parcel not found: " + id));
    }

    @Transactional
    public AgricultureParcel createParcel(AgricultureParcel parcel) {
        log.info("Creating parcel: {}", parcel.getCadastralNumber());
        return parcelRepository.save(parcel);
    }

    @Transactional
    public AgricultureParcel updateParcel(UUID id, AgricultureParcel updated) {
        log.info("Updating parcel: {}", id);
        AgricultureParcel existing = getParcelById(id);
        existing.setParcelNumber(updated.getParcelNumber());
        existing.setCadastralNumber(updated.getCadastralNumber());
        existing.setLandRegistryNumber(updated.getLandRegistryNumber());
        existing.setArea(updated.getArea());
        existing.setCategory(updated.getCategory());
        existing.setUsageType(updated.getUsageType());
        existing.setIrrigationType(updated.getIrrigationType());
        existing.setObservations(updated.getObservations());
        return parcelRepository.save(existing);
    }

    @Transactional
    public void deleteParcel(UUID id) {
        log.info("Soft-deleting parcel: {}", id);
        AgricultureParcel parcel = getParcelById(id);
        parcel.setIsActive(false);
        parcelRepository.save(parcel);
    }

    // === Members ===
    public List<AgricultureMember> getMembers(UUID householdId) {
        if (householdId != null) {
            return memberRepository.findByHouseholdIdAndIsActiveTrue(householdId);
        }
        return memberRepository.findByIsActiveTrue();
    }

    public AgricultureMember getMemberById(UUID id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found: " + id));
    }

    @Transactional
    public AgricultureMember createMember(AgricultureMember member) {
        log.info("Creating member: {} {}", member.getFirstName(), member.getLastName());
        return memberRepository.save(member);
    }

    @Transactional
    public AgricultureMember updateMember(UUID id, AgricultureMember updated) {
        log.info("Updating member: {}", id);
        AgricultureMember existing = getMemberById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setCnp(updated.getCnp());
        existing.setBirthDate(updated.getBirthDate());
        existing.setType(updated.getType());
        existing.setRelation(updated.getRelation());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setObservations(updated.getObservations());
        return memberRepository.save(existing);
    }

    @Transactional
    public void deleteMember(UUID id) {
        log.info("Soft-deleting member: {}", id);
        AgricultureMember member = getMemberById(id);
        member.setIsActive(false);
        memberRepository.save(member);
    }

    // === Animals ===
    public List<AgricultureAnimal> getAnimals(UUID householdId) {
        if (householdId != null) {
            return animalRepository.findByHouseholdIdAndIsActiveTrue(householdId);
        }
        return animalRepository.findByIsActiveTrue();
    }

    public AgricultureAnimal getAnimalById(UUID id) {
        return animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found: " + id));
    }

    @Transactional
    public AgricultureAnimal createAnimal(AgricultureAnimal animal) {
        log.info("Creating animal: {} - {}", animal.getAnimalType(), animal.getTagNumber());
        return animalRepository.save(animal);
    }

    @Transactional
    public AgricultureAnimal updateAnimal(UUID id, AgricultureAnimal updated) {
        log.info("Updating animal: {}", id);
        AgricultureAnimal existing = getAnimalById(id);
        existing.setAnimalType(updated.getAnimalType());
        existing.setSpecies(updated.getSpecies());
        existing.setBreed(updated.getBreed());
        existing.setTagNumber(updated.getTagNumber());
        existing.setPassportNumber(updated.getPassportNumber());
        existing.setBirthDate(updated.getBirthDate());
        existing.setSex(updated.getSex());
        existing.setQuantity(updated.getQuantity());
        existing.setObservations(updated.getObservations());
        return animalRepository.save(existing);
    }

    @Transactional
    public void deleteAnimal(UUID id) {
        log.info("Soft-deleting animal: {}", id);
        AgricultureAnimal animal = getAnimalById(id);
        animal.setIsActive(false);
        animalRepository.save(animal);
    }

    // === Machines ===
    public List<AgricultureMachine> getMachines(UUID householdId) {
        if (householdId != null) {
            return machineRepository.findByHouseholdIdAndIsActiveTrue(householdId);
        }
        return machineRepository.findByIsActiveTrue();
    }

    public AgricultureMachine getMachineById(UUID id) {
        return machineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine not found: " + id));
    }

    @Transactional
    public AgricultureMachine createMachine(AgricultureMachine machine) {
        log.info("Creating machine: {} {}", machine.getMachineType(), machine.getBrand());
        return machineRepository.save(machine);
    }

    @Transactional
    public AgricultureMachine updateMachine(UUID id, AgricultureMachine updated) {
        log.info("Updating machine: {}", id);
        AgricultureMachine existing = getMachineById(id);
        existing.setMachineType(updated.getMachineType());
        existing.setRegistrationNumber(updated.getRegistrationNumber());
        existing.setBrand(updated.getBrand());
        existing.setModel(updated.getModel());
        existing.setSerialNumber(updated.getSerialNumber());
        existing.setRegistrationDate(updated.getRegistrationDate());
        existing.setRegistrationExpiry(updated.getRegistrationExpiry());
        existing.setHorsePower(updated.getHorsePower());
        existing.setObservations(updated.getObservations());
        return machineRepository.save(existing);
    }

    @Transactional
    public void deleteMachine(UUID id) {
        log.info("Soft-deleting machine: {}", id);
        AgricultureMachine machine = getMachineById(id);
        machine.setIsActive(false);
        machineRepository.save(machine);
    }

    // === Stats ===
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalHouseholds", householdRepository.countActiveHouseholds());
        stats.put("totalParcels", parcelRepository.countActiveParcels());
        stats.put("totalMembers", memberRepository.countActiveMembers());
        stats.put("totalAnimals", animalRepository.countActiveAnimals());
        stats.put("totalMachines", machineRepository.countActiveMachines());
        return stats;
    }
}
