import React, { useState } from "react";
import { User, Shield, Briefcase, Award, UploadCloud, FileText, Trash2, Plus, X, Globe, RefreshCw } from "lucide-react";

export default function Profile({ user, onUserUpdate, showToast }) {
  // Editable fields for profile details
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user.bio || "Motivated engineering student focused on full-stack software development and problem solving.");
  const [name, setName] = useState(user.name);
  const [isEditingName, setIsEditingName] = useState(false);

  // Academic Profile states
  const [isEditingAcademics, setIsEditingAcademics] = useState(false);
  const [academicDept, setAcademicDept] = useState(user.department || "Computer Science");
  const [academicYear, setAcademicYear] = useState(user.year || "3rd Year");
  const [academicCgpa, setAcademicCgpa] = useState(user.cgpa !== undefined ? user.cgpa : 8.0);

  // Technical Skills state
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState(user.skills || []);

  // Certifications state
  const [certifications, setCertifications] = useState(user.certifications || []);
  const [showCertForm, setShowCertForm] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certOrg, setCertOrg] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certId, setCertId] = useState("");

  // Projects state
  const [projects, setProjects] = useState(user.projects || []);
  const [showProjForm, setShowProjForm] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("");
  const [projLink, setProjLink] = useState("");

  // Resume state
  const [resumeFile, setResumeFile] = useState(user.resume || null);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStatus, setParsingStatus] = useState("");

  // Helper to save data back to parent & localStorage
  const saveUserData = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields
    };
    onUserUpdate(updatedUser);
    localStorage.setItem("prep_student_user", JSON.stringify(updatedUser));
  };

  // Bio and Name updates
  const handleSaveDetails = () => {
    saveUserData({ name, bio });
    setIsEditingBio(false);
    setIsEditingName(false);
    showToast("Profile details updated successfully.", "success");
  };

  const handleSaveAcademics = () => {
    const cgpaNum = parseFloat(academicCgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      showToast("CGPA must be a valid number between 0.0 and 10.0.", "error");
      return;
    }
    saveUserData({
      department: academicDept,
      year: academicYear,
      cgpa: cgpaNum
    });
    setIsEditingAcademics(false);
    showToast("Academic profile updated successfully.", "success");
  };

  // Add Skill chip
  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = newSkill.trim();
    if (!cleanSkill) return;
    if (skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      showToast("Skill already exists in your profile.", "info");
      return;
    }
    const updatedSkills = [...skills, cleanSkill];
    setSkills(updatedSkills);
    saveUserData({ skills: updatedSkills });
    setNewSkill("");
    showToast(`Added skill: ${cleanSkill}`, "success");
  };

  // Remove Skill chip
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter(s => s !== skillToRemove);
    setSkills(updatedSkills);
    saveUserData({ skills: updatedSkills });
    showToast(`Removed skill: ${skillToRemove}`, "info");
  };

  // Add Certification
  const handleAddCert = (e) => {
    e.preventDefault();
    if (!certTitle.trim() || !certOrg.trim()) {
      showToast("Please enter at least Title and Issuing Organization.", "error");
      return;
    }
    const newCert = {
      id: Date.now().toString(),
      title: certTitle,
      org: certOrg,
      date: certDate,
      credentialId: certId
    };
    const updatedCerts = [...certifications, newCert];
    setCertifications(updatedCerts);
    saveUserData({ certifications: updatedCerts });
    
    // Reset form
    setCertTitle("");
    setCertOrg("");
    setCertDate("");
    setCertId("");
    setShowCertForm(false);
    showToast("Certification added to profile.", "success");
  };

  // Remove Certification
  const handleRemoveCert = (id) => {
    const updatedCerts = certifications.filter(c => c.id !== id);
    setCertifications(updatedCerts);
    saveUserData({ certifications: updatedCerts });
    showToast("Certification removed.", "info");
  };

  // Add Project
  const handleAddProj = (e) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDesc.trim()) {
      showToast("Please enter project title and description.", "error");
      return;
    }
    const newProj = {
      id: Date.now().toString(),
      title: projTitle,
      desc: projDesc,
      tech: projTech.split(",").map(t => t.trim()).filter(Boolean),
      link: projLink
    };
    const updatedProjs = [...projects, newProj];
    setProjects(updatedProjs);
    saveUserData({ projects: updatedProjs });

    // Reset form
    setProjTitle("");
    setProjDesc("");
    setProjTech("");
    setProjLink("");
    setShowProjForm(false);
    showToast("Project added to profile.", "success");
  };

  // Remove Project
  const handleRemoveProj = (id) => {
    const updatedProjs = projects.filter(p => p.id !== id);
    setProjects(updatedProjs);
    saveUserData({ projects: updatedProjs });
    showToast("Project removed.", "info");
  };

  // Resume Upload & Simulated Parser
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type (PDF/Word/Images)
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Only PDF or DOC/DOCX files are supported.", "error");
      return;
    }

    setIsParsing(true);
    setParsingProgress(10);
    setParsingStatus("Uploading resume file...");

    // Simulated parser progress
    setTimeout(() => {
      setParsingProgress(40);
      setParsingStatus("Extracting text and structure...");
    }, 800);

    setTimeout(() => {
      setParsingProgress(75);
      setParsingStatus("Analyzing skills and experiences...");
    }, 1600);

    setTimeout(() => {
      setParsingProgress(100);
      setParsingStatus("Resume parsed successfully!");
      
      const fileData = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        uploadedAt: new Date().toLocaleDateString()
      };

      setResumeFile(fileData);
      setIsParsing(false);
      saveUserData({ resume: fileData });
      showToast("Resume parsed and verified.", "success");
    }, 2500);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    saveUserData({ resume: null });
    showToast("Resume removed from profile.", "info");
  };

  return (
    <div style={styles.container} className="animate-slide-up">
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.avatarWrapper}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={styles.headerDetails}>
            {isEditingName ? (
              <div style={styles.editNameRow}>
                <input 
                  type="text" 
                  className="input-field" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  style={styles.editNameInput}
                />
                <button className="btn btn-primary" onClick={handleSaveDetails} style={styles.saveBtnSmall}>Save</button>
                <button className="btn btn-secondary" onClick={() => { setName(user.name); setIsEditingName(false); }} style={styles.saveBtnSmall}>Cancel</button>
              </div>
            ) : (
              <h2 style={styles.studentName}>
                {user.name}
                <button style={styles.editBtnLink} onClick={() => setIsEditingName(true)}>Edit</button>
              </h2>
            )}
            <p style={styles.studentMeta}>
              {user.year} • {user.department} • CGPA: {user.cgpa !== undefined ? user.cgpa.toFixed(2) : "8.00"}
            </p>
            <p style={styles.studentEmail}>{user.email}</p>
          </div>
        </div>
        <div className="badge" style={{ alignSelf: "flex-start" }}>
          <Shield size={14} style={{ marginRight: 4 }} /> Verified Student Profile
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div style={styles.dashboardGrid}>
        
        {/* LEFT COLUMN: BIO, ACADEMICS, SKILLS & RESUME */}
        <div style={styles.leftCol}>
          
          {/* BIO CARD */}
          <div className="glass-panel" style={styles.sectionCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}><User size={18} /> Professional Bio</h3>
              {!isEditingBio && (
                <button style={styles.editBtnLink} onClick={() => setIsEditingBio(true)}>Edit</button>
              )}
            </div>
            {isEditingBio ? (
              <div style={styles.editBioBlock}>
                <textarea 
                  className="input-field"
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={styles.textarea}
                />
                <div style={styles.editActions}>
                  <button className="btn btn-primary" onClick={handleSaveDetails}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => { setBio(user.bio || ""); setIsEditingBio(false); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <p style={styles.bioText}>{bio}</p>
            )}
          </div>

          {/* ACADEMIC PROFILE CARD */}
          <div className="glass-panel" style={styles.sectionCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}><Award size={18} /> Academic Profile</h3>
              {!isEditingAcademics && (
                <button style={styles.editBtnLink} onClick={() => setIsEditingAcademics(true)}>Edit</button>
              )}
            </div>
            {isEditingAcademics ? (
              <div style={styles.editAcademicBlock}>
                <div className="input-group">
                  <label className="input-label">Department</label>
                  <select 
                    className="input-field select-field"
                    value={academicDept}
                    onChange={(e) => setAcademicDept(e.target.value)}
                  >
                    <option value="Computer Science">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science (AIDS)</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering (EEE)</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication Engineering (ECE)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Year of Study</label>
                  <select 
                    className="input-field select-field"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Current CGPA (0.0 - 10.0)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="10"
                    className="input-field"
                    value={academicCgpa}
                    onChange={(e) => setAcademicCgpa(e.target.value)}
                  />
                </div>

                <div style={styles.editActions}>
                  <button className="btn btn-primary" onClick={handleSaveAcademics}>Save Academics</button>
                  <button className="btn btn-secondary" onClick={() => {
                    setAcademicDept(user.department || "Computer Science");
                    setAcademicYear(user.year || "3rd Year");
                    setAcademicCgpa(user.cgpa !== undefined ? user.cgpa : 8.0);
                    setIsEditingAcademics(false);
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={styles.academicInfo}>
                <div style={styles.academicDetailRow}>
                  <strong style={{ color: "var(--text-secondary)" }}>Department:</strong>
                  <span>{user.department}</span>
                </div>
                <div style={styles.academicDetailRow}>
                  <strong style={{ color: "var(--text-secondary)" }}>Academic Year:</strong>
                  <span>{user.year}</span>
                </div>
                <div style={styles.academicDetailRow}>
                  <strong style={{ color: "var(--text-secondary)" }}>Cumulative CGPA:</strong>
                  <span style={{ fontWeight: 700, color: "var(--brand-accent)" }}>
                    {user.cgpa !== undefined ? user.cgpa.toFixed(2) : "8.00"} / 10.00
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SKILLS CARD */}
          <div className="glass-panel" style={styles.sectionCard}>
            <h3 style={styles.cardTitle}><Briefcase size={18} /> Technical Skills</h3>
            <p style={styles.sectionSub}>Add your coding, engineering, and dev skills. These will be highlighted on your placement resume.</p>
            
            <form onSubmit={handleAddSkill} style={styles.skillForm}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. React, Python, Docker" 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                style={styles.skillInput}
              />
              <button type="submit" className="btn btn-primary" style={styles.addSkillBtn}>
                <Plus size={16} /> Add
              </button>
            </form>

            <div style={styles.chipsContainer}>
              {Array.isArray(skills) && skills.map((skill, index) => (
                <div className="badge" key={index} style={styles.skillChip}>
                  <span>{skill}</span>
                  <button type="button" style={styles.deleteChipBtn} onClick={() => handleRemoveSkill(skill)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              {(!Array.isArray(skills) || skills.length === 0) && (
                <p style={styles.emptyText}>No skills added yet. Start adding technical skills!</p>
              )}
            </div>
          </div>

          {/* RESUME UPLOAD CARD */}
          <div className="glass-panel" style={styles.sectionCard}>
            <h3 style={styles.cardTitle}><UploadCloud size={18} /> Professional Resume</h3>
            <p style={styles.sectionSub}>Upload your latest CV in PDF or DOCX format for placement profile sync.</p>

            {resumeFile ? (
              <div style={styles.resumeDisplay}>
                <div style={styles.resumeInfo}>
                  <FileText size={32} color="var(--brand-primary)" />
                  <div style={styles.resumeText}>
                    <p style={styles.resumeName}>{resumeFile.name}</p>
                    <p style={styles.resumeMeta}>{resumeFile.size} • Uploaded {resumeFile.uploadedAt}</p>
                  </div>
                </div>
                <button className="btn btn-secondary" style={styles.deleteResumeBtn} onClick={handleRemoveResume}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            ) : isParsing ? (
              <div style={styles.parsingBox}>
                <RefreshCw size={24} className="spin" style={styles.parsingSpinner} />
                <p style={styles.parsingLabel}>{parsingStatus}</p>
                <div style={styles.progressBg}>
                  <div style={{ ...styles.progressFill, width: `${parsingProgress}%` }} />
                </div>
              </div>
            ) : (
              <label style={styles.uploadZone}>
                <UploadCloud size={36} color="var(--text-secondary)" style={{ marginBottom: 12 }} />
                <p style={styles.uploadMain}>Click to browse or drag resume here</p>
                <p style={styles.uploadSub}>Supports PDF, DOC, DOCX up to 5MB</p>
                <input 
                  type="file" 
                  style={{ display: "none" }} 
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CERTIFICATIONS & PROJECTS */}
        <div style={styles.rightCol}>
          
          {/* CERTIFICATIONS CARD */}
          <div className="glass-panel" style={styles.sectionCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}><Award size={18} /> Certifications</h3>
              {!showCertForm && (
                <button className="btn btn-secondary btn-sm" onClick={() => setShowCertForm(true)} style={styles.btnSm}>
                  <Plus size={16} /> Add New
                </button>
              )}
            </div>

            {showCertForm && (
              <form onSubmit={handleAddCert} className="glass-card" style={styles.embedForm}>
                <h4 style={styles.formTitle}>New Certification</h4>
                <div className="input-group">
                  <label className="input-label" htmlFor="cert-name">Cert Name</label>
                  <input type="text" id="cert-name" className="input-field" placeholder="e.g. AWS Solutions Architect" value={certTitle} onChange={e => setCertTitle(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="cert-issuer">Issuer</label>
                  <input type="text" id="cert-issuer" className="input-field" placeholder="e.g. Amazon Web Services" value={certOrg} onChange={e => setCertOrg(e.target.value)} />
                </div>
                <div style={styles.formRow}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label" htmlFor="cert-date">Date</label>
                    <input type="date" id="cert-date" className="input-field" value={certDate} onChange={e => setCertDate(e.target.value)} />
                  </div>
                  <div className="input-group" style={{ flex: 1.5 }}>
                    <label className="input-label" htmlFor="cert-cred">Credential ID / URL</label>
                    <input type="text" id="cert-cred" className="input-field" placeholder="Optional" value={certId} onChange={e => setCertId(e.target.value)} />
                  </div>
                </div>
                <div style={styles.formActions}>
                  <button type="submit" className="btn btn-primary">Save Cert</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCertForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div style={styles.listContainer}>
              {Array.isArray(certifications) && certifications.map(cert => (
                <div className="glass-card" style={styles.listItem} key={cert.id}>
                  <div style={styles.listItemText}>
                    <h4 style={styles.itemTitle}>{cert.title}</h4>
                    <p style={styles.itemMeta}>{cert.org} {cert.date && `• ${cert.date}`}</p>
                    {cert.credentialId && <p style={styles.itemCred}>ID: {cert.credentialId}</p>}
                  </div>
                  <button style={styles.deleteItemBtn} onClick={() => handleRemoveCert(cert.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {(!Array.isArray(certifications) || certifications.length === 0) && !showCertForm && (
                <p style={styles.emptyText}>No certifications listed. Showcase your professional credentials!</p>
              )}
            </div>
          </div>

          {/* PROJECTS CARD */}
          <div className="glass-panel" style={styles.sectionCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}><Briefcase size={18} /> Projects</h3>
              {!showProjForm && (
                <button className="btn btn-secondary btn-sm" onClick={() => setShowProjForm(true)} style={styles.btnSm}>
                  <Plus size={16} /> Add New
                </button>
              )}
            </div>

            {showProjForm && (
              <form onSubmit={handleAddProj} className="glass-card" style={styles.embedForm}>
                <h4 style={styles.formTitle}>New Project</h4>
                <div className="input-group">
                  <label className="input-label" htmlFor="proj-name">Title</label>
                  <input type="text" id="proj-name" className="input-field" placeholder="e.g. E-Commerce Backend API" value={projTitle} onChange={e => setProjTitle(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="proj-desc">Description</label>
                  <textarea rows="3" id="proj-desc" className="input-field" placeholder="Brief details about your role and technology..." value={projDesc} onChange={e => setProjDesc(e.target.value)} style={styles.textarea} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="proj-tech">Tech Stack (comma separated)</label>
                  <input type="text" id="proj-tech" className="input-field" placeholder="e.g. Node.js, Express, Postgres" value={projTech} onChange={e => setProjTech(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="proj-link">Project Link (GitHub/Live)</label>
                  <input type="text" id="proj-link" className="input-field" placeholder="e.g. https://github.com/..." value={projLink} onChange={e => setProjLink(e.target.value)} />
                </div>
                <div style={styles.formActions}>
                  <button type="submit" className="btn btn-primary">Save Project</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProjForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div style={styles.listContainer}>
              {Array.isArray(projects) && projects.map(proj => (
                <div className="glass-card" style={styles.projItem} key={proj.id}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.cardHeader}>
                      <h4 style={styles.itemTitle}>{proj.title}</h4>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" style={styles.projLink}>
                          <Globe size={14} /> Link
                        </a>
                      )}
                    </div>
                    <p style={styles.projDesc}>{proj.desc}</p>
                    <div style={styles.projTechRow}>
                      {Array.isArray(proj.tech) && proj.tech.map((t, idx) => (
                        <span key={idx} style={styles.projTechBadge}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <button style={styles.deleteItemBtn} onClick={() => handleRemoveProj(proj.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {(!Array.isArray(projects) || projects.length === 0) && !showProjForm && (
                <p style={styles.emptyText}>No projects listed. Highlight your software engineering projects!</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px 0"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderRadius: "16px",
    background: "var(--bg-secondary)",
    border: "var(--glass-border)",
    backdropFilter: "var(--glass-blur)",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px"
  },
  avatarWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "var(--brand-gradient)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: 700,
    boxShadow: "var(--shadow-sm)"
  },
  headerDetails: {
    textAlign: "left"
  },
  studentName: {
    fontSize: "1.6rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "var(--text-primary)"
  },
  editNameRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  editNameInput: {
    fontSize: "1.2rem",
    padding: "6px 12px",
    maxWidth: "200px"
  },
  saveBtnSmall: {
    padding: "6px 12px",
    fontSize: "0.85rem"
  },
  studentMeta: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
    fontWeight: 500
  },
  studentEmail: {
    color: "var(--brand-primary)",
    fontSize: "0.85rem"
  },
  editBtnLink: {
    background: "none",
    border: "none",
    color: "var(--brand-primary)",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    padding: "4px 8px"
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.1fr",
    gap: "28px"
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  },
  sectionCard: {
    padding: "24px",
    textAlign: "left"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px"
  },
  cardTitle: {
    fontSize: "1.15rem",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  sectionSub: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    marginBottom: "16px"
  },
  bioText: {
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    lineHeight: "1.6"
  },
  editBioBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  textarea: {
    resize: "none",
    lineHeight: "1.5"
  },
  editActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end"
  },
  skillForm: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px"
  },
  skillInput: {
    flex: 1
  },
  addSkillBtn: {
    padding: "0 16px"
  },
  chipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },
  skillChip: {
    padding: "6px 12px",
    background: "rgba(144, 97, 249, 0.08)",
    border: "1px solid rgba(144, 97, 249, 0.15)",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "16px"
  },
  deleteChipBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center"
  },
  emptyText: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    fontStyle: "italic",
    padding: "10px 0"
  },
  uploadZone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed var(--border-color)",
    borderRadius: "12px",
    padding: "30px 20px",
    cursor: "pointer",
    transition: "border-color 0.3s ease",
    background: "rgba(255, 255, 255, 0.01)"
  },
  uploadMain: {
    fontWeight: 600,
    fontSize: "0.95rem",
    marginBottom: "4px"
  },
  uploadSub: {
    color: "var(--text-secondary)",
    fontSize: "0.8rem"
  },
  resumeDisplay: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    border: "var(--glass-border)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.02)"
  },
  resumeInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  resumeText: {
    textAlign: "left"
  },
  resumeName: {
    fontWeight: 600,
    fontSize: "0.95rem"
  },
  resumeMeta: {
    color: "var(--text-secondary)",
    fontSize: "0.8rem"
  },
  deleteResumeBtn: {
    padding: "8px 12px",
    fontSize: "0.8rem"
  },
  parsingBox: {
    textAlign: "center",
    padding: "20px",
    border: "var(--glass-border)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.02)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px"
  },
  parsingSpinner: {
    color: "var(--brand-primary)"
  },
  parsingLabel: {
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "var(--text-secondary)"
  },
  progressBg: {
    width: "100%",
    height: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "3px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "var(--brand-primary)",
    borderRadius: "3px",
    transition: "width 0.4s ease"
  },
  btnSm: {
    padding: "6px 12px",
    fontSize: "0.85rem"
  },
  embedForm: {
    padding: "20px",
    marginBottom: "20px",
    textAlign: "left"
  },
  formTitle: {
    fontSize: "1rem",
    marginBottom: "14px",
    color: "var(--brand-accent)"
  },
  formRow: {
    display: "flex",
    gap: "12px"
  },
  formActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "10px"
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    textAlign: "left"
  },
  listItemText: {
    flex: 1
  },
  itemTitle: {
    fontSize: "0.95rem",
    fontWeight: 600
  },
  itemMeta: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem"
  },
  itemCred: {
    fontSize: "0.8rem",
    color: "var(--brand-accent)",
    marginTop: "2px"
  },
  deleteItemBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "8px",
    transition: "color 0.2s ease"
  },
  projItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "16px",
    textAlign: "left"
  },
  projDesc: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    margin: "8px 0"
  },
  projLink: {
    fontSize: "0.8rem",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px"
  },
  projTechRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "8px"
  },
  projTechBadge: {
    fontSize: "0.75rem",
    padding: "3px 8px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)"
  },
  academicInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "8px"
  },
  academicDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
    fontSize: "0.95rem"
  },
  editAcademicBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "8px"
  }
};
