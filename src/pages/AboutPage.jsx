import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { teamService, aboutService } from '../utils/storage';

// You can add team members through admin or hardcode them here
const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Founder Name',
    role: 'Founder & CEO',
    image: '', // Add image URL or upload through admin
    bio: 'Leading UniBridge with a vision to connect opportunities worldwide.'
  },
  // Add more team members as needed
];

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [aboutContent, setAboutContent] = useState({
    intro: "It's hard to believe people or know if your donation and help is getting into the right hands. This is where UniBridge comes in.",
    mission: 'UniBridge Foundation is a non-profit organization focused on finding opportunities for organizations and people who need them most. We serve as a bridge between those who want to help and those who need support.',
    whatWeDo: 'We find, verify, and channel help to the right people and organizations. Our rigorous vetting process ensures that every donation, every resource, and every bit of support reaches verified recipients who truly need it.',
    volunteerExperience: 'While on the mission of helping, volunteers who join us will also experience safari trips during their service. We believe in creating meaningful connections not just with the communities we serve, but also with the beautiful environments we work in.'
  });

  useEffect(() => {
    const fetchData = async () => {
      // Load team members from Supabase
      const team = await teamService.getAllMembers();
      setTeamMembers(team.length > 0 ? team : TEAM_MEMBERS);

      // Load about content from Supabase
      const content = await aboutService.getAboutContent();
      setAboutContent({
        intro: content.intro || aboutContent.intro,
        mission: content.mission || aboutContent.mission,
        whatWeDo: content.what_we_do || aboutContent.whatWeDo,
        volunteerExperience: content.volunteer_experience || aboutContent.volunteerExperience
      });
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-unibridge-navy mb-4">
              About UniBridge
            </h1>
            <div className="w-20 h-1 bg-unibridge-blue mx-auto"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
              {aboutContent.intro}
            </p>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy mt-12 mb-6">Our Mission</h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              {aboutContent.mission}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy mt-12 mb-6">What We Do</h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              {aboutContent.whatWeDo}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy mt-12 mb-6">Volunteer Experience</h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              {aboutContent.volunteerExperience}
            </p>

            <div className="bg-unibridge-blue/5 border-l-4 border-unibridge-blue p-6 rounded-r-lg mt-12">
              <p className="text-xl font-semibold text-unibridge-navy mb-2">
                We Love Those You Love.
              </p>
              <p className="text-gray-700">
                This is our commitment - to care for the causes and people you care about, 
                ensuring your support makes a real difference.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-unibridge-navy mb-4">
              Our Team
            </h2>
            <div className="w-20 h-1 bg-unibridge-blue mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600">
              The people making it happen
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-500">Team members will be added soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {teamMembers.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="mb-6">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-48 h-48 rounded-full mx-auto bg-gradient-to-br from-unibridge-blue to-blue-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-5xl font-bold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-unibridge-navy mb-2">
                    {member.name}
                  </h3>
                  <p className="text-unibridge-blue font-semibold mb-3">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
