package ro.pdi.urbanism.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ro.pdi.urbanism.model.*;
import ro.pdi.urbanism.repository.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/urbanism")
public class UrbanismController {

    private final UrbanismRegisterRepository registerRepository;
    private final UrbanismUTRRepository utrRepository;
    private final CertificateUrbanismRepository cuRepository;
    private final AuthorizationRepository acRepository;
    private final CertificateNomenclatureRepository cnsRepository;

    public UrbanismController(
            UrbanismRegisterRepository registerRepository,
            UrbanismUTRRepository utrRepository,
            CertificateUrbanismRepository cuRepository,
            AuthorizationRepository acRepository,
            CertificateNomenclatureRepository cnsRepository) {
        this.registerRepository = registerRepository;
        this.utrRepository = utrRepository;
        this.cuRepository = cuRepository;
        this.acRepository = acRepository;
        this.cnsRepository = cnsRepository;
    }

    @GetMapping("/registers")
    public ResponseEntity<List<UrbanismRegister>> getRegisters(
            @RequestParam(required = false) UrbanismRegister.RegisterType type) {
        if (type != null) {
            return ResponseEntity.ok(registerRepository.findByRegisterType(type));
        }
        return ResponseEntity.ok(registerRepository.findAll());
    }

    @PostMapping("/registers")
    public ResponseEntity<UrbanismRegister> createRegister(@RequestBody UrbanismRegister register) {
        return ResponseEntity.ok(registerRepository.save(register));
    }

    @GetMapping("/utrs")
    public ResponseEntity<List<UrbanismUTR>> getUTRs() {
        return ResponseEntity.ok(utrRepository.findByIsActiveTrue());
    }

    @PostMapping("/utrs")
    public ResponseEntity<UrbanismUTR> createUTR(@RequestBody UrbanismUTR utr) {
        return ResponseEntity.ok(utrRepository.save(utr));
    }

    @GetMapping("/certificates-urbanism")
    public ResponseEntity<List<CertificateUrbanism>> getCUs(
            @RequestParam(required = false) UUID applicantId,
            @RequestParam(required = false) CertificateUrbanism.CUStatus status) {
        if (applicantId != null) {
            return ResponseEntity.ok(cuRepository.findByApplicantId(applicantId));
        }
        if (status != null) {
            return ResponseEntity.ok(cuRepository.findByStatus(status));
        }
        return ResponseEntity.ok(cuRepository.findAll());
    }

    @GetMapping("/authorizations")
    public ResponseEntity<List<Authorization>> getACs(
            @RequestParam(required = false) UUID applicantId,
            @RequestParam(required = false) Authorization.ACStatus status) {
        if (applicantId != null) {
            return ResponseEntity.ok(acRepository.findByApplicantId(applicantId));
        }
        if (status != null) {
            return ResponseEntity.ok(acRepository.findByStatus(status));
        }
        return ResponseEntity.ok(acRepository.findAll());
    }

    @GetMapping("/certificates-nomenclature")
    public ResponseEntity<List<CertificateNomenclature>> getCNS(
            @RequestParam(required = false) UUID applicantId) {
        if (applicantId != null) {
            return ResponseEntity.ok(cnsRepository.findByApplicantId(applicantId));
        }
        return ResponseEntity.ok(cnsRepository.findAll());
    }
}